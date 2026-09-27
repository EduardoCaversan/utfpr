const http = require('http');
const eventos = require('./eventos');

const porta = 3001;

// Esta função monta a resposta antes de enviá-la ao cliente.
function enviarJson(resposta, status, conteudo) {
  resposta.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  resposta.end(JSON.stringify(conteudo, null, 2));
}

const servidor = http.createServer((requisicao, resposta) => {
  const url = new URL(requisicao.url, `http://${requisicao.headers.host || 'localhost'}`);
  const rota = url.pathname;

  // A aplicação oferece somente consultas, por isso as rotas usam GET.
  if (requisicao.method !== 'GET') {
    enviarJson(resposta, 404, { erro: 'Rota não encontrada.' });
    return;
  }

  if (rota === '/') {
    enviarJson(resposta, 200, {
      mensagem: 'Bem-vindo à API Agenda de Eventos.',
      descricao: 'Consulte eventos de hoje, futuros ou pelo identificador.',
      rotas: ['/eventos', '/eventos/hoje', '/eventos/futuros', '/evento/:id', '/sobre']
    });
    return;
  }

  if (rota === '/eventos') {
    enviarJson(resposta, 200, eventos);
    return;
  }

  if (rota === '/eventos/hoje') {
    const eventosHoje = eventos.filter((evento) => evento.periodo === 'hoje');
    enviarJson(resposta, 200, eventosHoje);
    return;
  }

  if (rota === '/eventos/futuros') {
    const eventosFuturos = eventos.filter((evento) => evento.periodo === 'futuro');
    enviarJson(resposta, 200, eventosFuturos);
    return;
  }

  if (rota.startsWith('/evento/')) {
    const idTexto = rota.substring('/evento/'.length);
    const id = Number(idTexto);
    const evento = eventos.find((item) => item.id === id);

    if (!idTexto || !Number.isInteger(id) || !evento) {
      enviarJson(resposta, 404, { erro: 'Evento não encontrado.' });
      return;
    }

    enviarJson(resposta, 200, evento);
    return;
  }

  if (rota === '/sobre') {
    enviarJson(resposta, 200, {
      aplicacao: 'Agenda de Eventos',
      tecnologia: 'Node.js com módulo nativo http',
      objetivo: 'Demonstrar o recebimento de requisições e o envio de respostas HTTP no servidor.'
    });
    return;
  }

  enviarJson(resposta, 404, { erro: 'Rota não encontrada.' });
});

servidor.listen(porta, () => {
  console.log(`Servidor em execução em http://localhost:${porta}`);
});
