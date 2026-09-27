const http = require('http');
const crypto = require('crypto');
const produtos = require('./produtos');

const porta = 3002;
const sessoes = new Map();

function lerCookies(cabecalhoCookie) {
  if (!cabecalhoCookie) {
    return {};
  }

  return cabecalhoCookie.split(';').reduce((cookies, item) => {
    const [nome, ...valor] = item.trim().split('=');
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

  const novoId = crypto.randomUUID();
  const novaSessao = {
    carrinho: [],
    criadaEm: new Date().toISOString()
  };
  sessoes.set(novoId, novaSessao);

  return { id: novoId, dados: novaSessao, criadaAgora: true };
}

function enviarJson(resposta, status, conteudo, idSessaoNova) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8'
  };

  // O navegador recebe somente o identificador. Os dados continuam no Map do servidor.
  if (idSessaoNova) {
    headers['Set-Cookie'] = `idSessao=${encodeURIComponent(idSessaoNova)}; Path=/; HttpOnly; SameSite=Lax`;
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

const servidor = http.createServer(async (requisicao, resposta) => {
  const url = new URL(requisicao.url, `http://${requisicao.headers.host || 'localhost'}`);
  const rota = url.pathname;
  const sessao = obterSessao(requisicao);
  const cookieNovo = sessao.criadaAgora ? sessao.id : undefined;

  if (requisicao.method === 'GET' && rota === '/') {
    enviarJson(resposta, 200, {
      mensagem: 'Bem-vindo ao Carrinho por Sessão.',
      descricao: 'Use as rotas para consultar produtos e manter um carrinho associado ao seu cookie de sessão.'
    }, cookieNovo);
    return;
  }

  if (requisicao.method === 'GET' && rota === '/produtos') {
    enviarJson(resposta, 200, produtos, cookieNovo);
    return;
  }

  if (requisicao.method === 'POST' && rota === '/carrinho/adicionar') {
    try {
      const corpo = await lerCorpo(requisicao);
      const { produtoId } = JSON.parse(corpo);
      const produto = produtos.find((item) => item.id === Number(produtoId));

      if (!produto) {
        enviarJson(resposta, 400, { erro: 'Informe um produtoId válido.' }, cookieNovo);
        return;
      }

      sessao.dados.carrinho.push(produto);
      enviarJson(resposta, 201, {
        mensagem: 'Produto adicionado ao carrinho da sessão.',
        produto
      }, cookieNovo);
    } catch (erro) {
      enviarJson(resposta, 400, { erro: 'Envie um corpo JSON válido com produtoId.' }, cookieNovo);
    }
    return;
  }

  if (requisicao.method === 'GET' && rota === '/carrinho') {
    enviarJson(resposta, 200, {
      quantidadeItens: sessao.dados.carrinho.length,
      produtos: sessao.dados.carrinho
    }, cookieNovo);
    return;
  }

  if (requisicao.method === 'POST' && rota === '/carrinho/limpar') {
    sessao.dados.carrinho = [];
    enviarJson(resposta, 200, { mensagem: 'Carrinho da sessão limpo com sucesso.' }, cookieNovo);
    return;
  }

  if (requisicao.method === 'GET' && rota === '/sessao') {
    enviarJson(resposta, 200, {
      ativa: true,
      quantidadeItensNoCarrinho: sessao.dados.carrinho.length,
      criadaEm: sessao.dados.criadaEm
    }, cookieNovo);
    return;
  }

  enviarJson(resposta, 404, { erro: 'Rota não encontrada.' }, cookieNovo);
});

servidor.listen(porta, () => {
  console.log(`Servidor em execução em http://localhost:${porta}`);
});
