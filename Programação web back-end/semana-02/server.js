const http = require('http');

const porta = 3000;

// Dados fictícios mantidos em memória, apenas para demonstrar as rotas HTTP.
const encomendas = [
  { codigo: 'BR123', destinatario: 'Ana Souza', status: 'em trânsito', cidade: 'Curitiba' },
  { codigo: 'BR456', destinatario: 'Bruno Lima', status: 'entregue', cidade: 'Londrina' },
  { codigo: 'BR789', destinatario: 'Carla Reis', status: 'postado', cidade: 'Ponta Grossa' }
];

function responderJson(resposta, status, dados) {
  resposta.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  resposta.end(JSON.stringify(dados, null, 2));
}

function lerCorpo(requisicao) {
  return new Promise((resolve, reject) => {
    let corpo = '';

    requisicao.on('data', (parte) => {
      corpo += parte;
    });

    requisicao.on('end', () => resolve(corpo));
    requisicao.on('error', reject);
  });
}

const servidor = http.createServer(async (requisicao, resposta) => {
  const url = new URL(requisicao.url, `http://${requisicao.headers.host || 'localhost'}`);
  const caminho = url.pathname;
  const metodo = requisicao.method;

  if (metodo === 'GET' && caminho === '/') {
    responderJson(resposta, 200, {
      mensagem: 'Bem-vindo à API de Rastreamento de Encomendas.',
      rotas: ['GET /encomendas', 'GET /encomendas/:codigo', 'GET /buscar?status=entregue', 'GET /cabecalhos', 'POST /encomendas']
    });
    return;
  }

  if (metodo === 'GET' && caminho === '/encomendas') {
    responderJson(resposta, 200, encomendas);
    return;
  }

  if (metodo === 'GET' && caminho.startsWith('/encomendas/')) {
    // O código é um parâmetro presente diretamente no caminho da URL.
    const codigo = decodeURIComponent(caminho.substring('/encomendas/'.length));
    const encomenda = encomendas.find((item) => item.codigo.toLowerCase() === codigo.toLowerCase());

    if (!codigo || codigo.includes('/')) {
      responderJson(resposta, 404, { erro: 'Rota não encontrada.' });
      return;
    }

    if (!encomenda) {
      responderJson(resposta, 404, { erro: 'Encomenda não encontrada.' });
      return;
    }

    responderJson(resposta, 200, encomenda);
    return;
  }

  if (metodo === 'GET' && caminho === '/buscar') {
    // status vem da query string: /buscar?status=entregue
    const status = url.searchParams.get('status');

    if (!status) {
      responderJson(resposta, 400, { erro: 'Informe o parâmetro de consulta status.' });
      return;
    }

    const resultado = encomendas.filter((item) => item.status.toLowerCase() === status.toLowerCase());
    responderJson(resposta, 200, resultado);
    return;
  }

  if (metodo === 'GET' && caminho === '/cabecalhos') {
    responderJson(resposta, 200, {
      userAgent: requisicao.headers['user-agent'] || 'Não informado',
      accept: requisicao.headers.accept || 'Não informado',
      host: requisicao.headers.host || 'Não informado'
    });
    return;
  }

  if (metodo === 'POST' && caminho === '/encomendas') {
    try {
      const corpo = await lerCorpo(requisicao);
      const novaEncomenda = JSON.parse(corpo);
      const { codigo, destinatario, status, cidade } = novaEncomenda;

      if (!codigo || !destinatario || !status || !cidade) {
        responderJson(resposta, 400, { erro: 'Informe codigo, destinatario, status e cidade.' });
        return;
      }

      if (encomendas.some((item) => item.codigo.toLowerCase() === String(codigo).toLowerCase())) {
        responderJson(resposta, 400, { erro: 'Já existe uma encomenda com este código.' });
        return;
      }

      const encomendaCadastrada = { codigo, destinatario, status, cidade };
      encomendas.push(encomendaCadastrada);
      responderJson(resposta, 201, {
        mensagem: 'Encomenda cadastrada com sucesso.',
        encomenda: encomendaCadastrada
      });
    } catch (erro) {
      responderJson(resposta, 400, { erro: 'O corpo da requisição deve ser um JSON válido.' });
    }
    return;
  }

  responderJson(resposta, 404, { erro: 'Rota não encontrada.' });
});

servidor.listen(porta, () => {
  console.log(`Servidor em execução em http://localhost:${porta}`);
});
