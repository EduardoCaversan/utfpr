const http = require('http');

const PORTA = process.env.PORT || 3000;

const livros = [
  {
    id: 1,
    titulo: 'O Caminho das Estrelas',
    autor: 'Marina Campos',
    disponivel: true
  },
  {
    id: 2,
    titulo: 'Histórias da Cidade Azul',
    autor: 'Rafael Nunes',
    disponivel: false
  },
  {
    id: 3,
    titulo: 'Pequeno Guia de Ciência',
    autor: 'Lia Monteiro',
    disponivel: true
  }
];

function responderJson(resposta, statusCode, dados) {
  resposta.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  resposta.end(JSON.stringify(dados, null, 2));
}

const servidor = http.createServer((requisicao, resposta) => {
  const url = new URL(requisicao.url, `http://${requisicao.headers.host}`);
  const { method } = requisicao;
  const { pathname } = url;

  console.log(`${new Date().toISOString()} - ${method} ${pathname}`);

  if (method !== 'GET') {
    return responderJson(resposta, 404, {
      erro: 'Rota não encontrada',
      mensagem: `O método ${method} não é atendido nesta rota.`
    });
  }

  if (pathname === '/') {
    resposta.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return resposta.end('Servidor da Biblioteca HTTP está funcionando.');
  }

  if (pathname === '/livros') {
    return responderJson(resposta, 200, { livros });
  }

  if (pathname === '/biblioteca') {
    return responderJson(resposta, 200, {
      nome: 'Biblioteca Horizonte',
      endereco: 'Rua do Conhecimento, 21',
      horario: 'Segunda a sexta, das 8h às 18h',
      quantidadeDeLivros: livros.length
    });
  }

  if (pathname === '/status') {
    return responderJson(resposta, 200, {
      status: 'online',
      servidor: 'biblioteca-http',
      horarioDaResposta: new Date().toISOString()
    });
  }

  return responderJson(resposta, 404, {
    erro: 'Rota não encontrada',
    mensagem: `Não existe uma rota GET para ${pathname}.`
  });
});

servidor.listen(PORTA, () => {
  console.log(`Servidor disponível em http://localhost:${PORTA}`);
});
