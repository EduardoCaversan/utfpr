const { carregarTrilhas, resumirTrilhas, DIFICULDADES } = require('./catalogo');

function responder(resposta, status, dados, cabecalhos = {}) {
  resposta.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...cabecalhos
  });
  resposta.end(JSON.stringify(dados));
}

function criarApp(caminhoArquivo) {
  return (requisicao, resposta) => {
    const url = new URL(requisicao.url, 'http://localhost');
    const { pathname, searchParams } = url;
    const rotaTrilha = /^\/trilhas\/([^/]+)$/.exec(pathname);
    const rotaExiste = pathname === '/' || pathname === '/trilhas' ||
      pathname === '/resumo' || rotaTrilha;

    if (!rotaExiste) {
      return responder(resposta, 404, { erro: 'Rota não encontrada.' });
    }
    if (requisicao.method !== 'GET') {
      return responder(resposta, 405, { erro: 'Método não permitido.' }, { Allow: 'GET' });
    }
    if (pathname === '/') {
      return responder(resposta, 200, {
        nome: 'Catálogo de trilhas de caminhada',
        rotas: ['/trilhas', '/trilhas?dificuldade=facil', '/trilhas/:id', '/resumo']
      });
    }

    if (pathname === '/trilhas' && searchParams.has('dificuldade') &&
        (searchParams.getAll('dificuldade').length !== 1 ||
         !DIFICULDADES.includes(searchParams.get('dificuldade')))) {
      return responder(resposta, 400, { erro: 'Dificuldade inválida. Use facil, moderada ou dificil.' });
    }

    let id;
    if (rotaTrilha) {
      id = Number(rotaTrilha[1]);
      if (!/^[1-9]\d*$/.test(rotaTrilha[1]) || !Number.isSafeInteger(id)) {
        return responder(resposta, 400, { erro: 'O identificador deve ser um inteiro positivo.' });
      }
    }

    try {
      const trilhas = carregarTrilhas(caminhoArquivo);
      if (pathname === '/resumo') {
        return responder(resposta, 200, resumirTrilhas(trilhas));
      }
      if (rotaTrilha) {
        const trilha = trilhas.find((item) => item.id === id);
        return trilha
          ? responder(resposta, 200, trilha)
          : responder(resposta, 404, { erro: 'Trilha não encontrada.' });
      }
      const dificuldade = searchParams.get('dificuldade');
      const resultado = dificuldade
        ? trilhas.filter((trilha) => trilha.dificuldade === dificuldade)
        : trilhas;
      return responder(resposta, 200, resultado);
    } catch (erro) {
      // Erros de arquivo, JSON e dados são internos; detalhes não vão para a resposta.
      return responder(resposta, 500, { erro: 'Não foi possível consultar o catálogo.' });
    }
  };
}

module.exports = { criarApp };
