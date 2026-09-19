const http = require('http');
const crypto = require('crypto');
const salas = require('./salas');

const porta = 3003;
const sessoes = new Map();
let proximoIdReserva = 1;

function lerCookies(cabecalhoCookie) {
  if (!cabecalhoCookie) return {};

  return cabecalhoCookie.split(';').reduce((cookies, parte) => {
    const [nome, ...valor] = parte.trim().split('=');
    cookies[nome] = decodeURIComponent(valor.join('='));
    return cookies;
  }, {});
}

function obterSessao(requisicao) {
  const cookies = lerCookies(requisicao.headers.cookie);
  const idRecebido = cookies.idSessao;

  if (idRecebido && sessoes.has(idRecebido)) {
    return { id: idRecebido, dados: sessoes.get(idRecebido), criadaAgora: false };
  }

  const id = crypto.randomUUID();
  const dados = { reservas: [], criadaEm: new Date().toISOString() };
  sessoes.set(id, dados);
  return { id, dados, criadaAgora: true };
}

function enviarJson(resposta, status, conteudo, novoIdSessao) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8' };

  if (novoIdSessao) {
    headers['Set-Cookie'] = `idSessao=${encodeURIComponent(novoIdSessao)}; Path=/; HttpOnly; SameSite=Lax`;
  }

  resposta.writeHead(status, headers);
  resposta.end(JSON.stringify(conteudo, null, 2));
}

function lerCorpo(requisicao) {
  return new Promise((resolve, reject) => {
    let corpo = '';
    requisicao.on('data', (parte) => { corpo += parte; });
    requisicao.on('end', () => resolve(corpo));
    requisicao.on('error', reject);
  });
}

function horarioValido(horario) {
  if (typeof horario !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)) {
    return false;
  }
  return true;
}

// Procura em todas as sessões: uma sala não pode ser ocupada no mesmo horário.
function salaEstaOcupada(salaId, horario) {
  for (const sessao of sessoes.values()) {
    if (sessao.reservas.some((reserva) => reserva.sala.id === salaId && reserva.horario === horario)) {
      return true;
    }
  }
  return false;
}

const servidor = http.createServer(async (requisicao, resposta) => {
  const url = new URL(requisicao.url, `http://${requisicao.headers.host || 'localhost'}`);
  const rota = url.pathname;
  const sessao = obterSessao(requisicao);
  const cookieNovo = sessao.criadaAgora ? sessao.id : undefined;

  if (requisicao.method === 'GET' && rota === '/') {
    enviarJson(resposta, 200, {
      mensagem: 'Bem-vindo à API Reserva de Salas.',
      descricao: 'Consulte salas e crie reservas associadas à sua sessão.',
      rotas: ['/salas', '/salas/:id', '/reservas', '/reservas/cancelar', '/sessao']
    }, cookieNovo);
    return;
  }

  if (requisicao.method === 'GET' && rota === '/salas') {
    const capacidadeTexto = url.searchParams.get('capacidade');
    let resultado = salas;

    if (capacidadeTexto !== null) {
      const capacidade = Number(capacidadeTexto);
      if (!Number.isInteger(capacidade) || capacidade <= 0) {
        enviarJson(resposta, 400, { erro: 'O parâmetro capacidade deve ser um número inteiro positivo.' }, cookieNovo);
        return;
      }
      resultado = salas.filter((sala) => sala.capacidade >= capacidade);
    }

    enviarJson(resposta, 200, resultado, cookieNovo);
    return;
  }

  if (requisicao.method === 'GET' && rota.startsWith('/salas/')) {
    const idTexto = rota.substring('/salas/'.length);
    const id = Number(idTexto);
    const sala = salas.find((item) => item.id === id);

    if (!idTexto || !Number.isInteger(id) || !sala) {
      enviarJson(resposta, 404, { erro: 'Sala não encontrada.' }, cookieNovo);
      return;
    }

    enviarJson(resposta, 200, sala, cookieNovo);
    return;
  }

  if (requisicao.method === 'GET' && rota === '/reservas') {
    enviarJson(resposta, 200, {
      quantidade: sessao.dados.reservas.length,
      reservas: sessao.dados.reservas
    }, cookieNovo);
    return;
  }

  if (requisicao.method === 'POST' && rota === '/reservas') {
    try {
      const { salaId, horario } = JSON.parse(await lerCorpo(requisicao));
      const sala = salas.find((item) => item.id === Number(salaId));

      if (!sala) {
        enviarJson(resposta, 404, { erro: 'Sala não encontrada para reserva.' }, cookieNovo);
        return;
      }

      if (!horarioValido(horario)) {
        enviarJson(resposta, 400, { erro: 'Informe um horário válido no formato HH:MM.' }, cookieNovo);
        return;
      }

      if (salaEstaOcupada(sala.id, horario)) {
        enviarJson(resposta, 409, { erro: 'A sala já está ocupada nesse horário.' }, cookieNovo);
        return;
      }

      const reserva = { id: proximoIdReserva++, sala, horario };
      sessao.dados.reservas.push(reserva);
      enviarJson(resposta, 201, { mensagem: 'Reserva criada com sucesso.', reserva }, cookieNovo);
    } catch (erro) {
      enviarJson(resposta, 400, { erro: 'Envie um corpo JSON válido com salaId e horario.' }, cookieNovo);
    }
    return;
  }

  if (requisicao.method === 'POST' && rota === '/reservas/cancelar') {
    try {
      const { reservaId } = JSON.parse(await lerCorpo(requisicao));
      const indice = sessao.dados.reservas.findIndex((reserva) => reserva.id === Number(reservaId));

      if (indice === -1) {
        enviarJson(resposta, 404, { erro: 'Reserva não encontrada na sessão atual.' }, cookieNovo);
        return;
      }

      const [reservaCancelada] = sessao.dados.reservas.splice(indice, 1);
      enviarJson(resposta, 200, { mensagem: 'Reserva cancelada com sucesso.', reserva: reservaCancelada }, cookieNovo);
    } catch (erro) {
      enviarJson(resposta, 400, { erro: 'Envie um corpo JSON válido com reservaId.' }, cookieNovo);
    }
    return;
  }

  if (requisicao.method === 'GET' && rota === '/sessao') {
    enviarJson(resposta, 200, {
      ativa: true,
      quantidadeReservas: sessao.dados.reservas.length,
      criadaEm: sessao.dados.criadaEm
    }, cookieNovo);
    return;
  }

  enviarJson(resposta, 404, { erro: 'Rota não encontrada.' }, cookieNovo);
});

servidor.listen(porta, () => {
  console.log(`Servidor em execução em http://localhost:${porta}`);
});
