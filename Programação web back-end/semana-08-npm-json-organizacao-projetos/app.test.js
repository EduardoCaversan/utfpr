const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { criarApp } = require('./app');

async function consultar(servidor, rota, metodo = 'GET') {
  const resposta = await fetch(`http://127.0.0.1:${servidor.address().port}${rota}`, { method: metodo });
  return { status: resposta.status, allow: resposta.headers.get('allow'), dados: await resposta.json() };
}

async function comServidor(caminhoArquivo, executar) {
  const servidor = http.createServer(criarApp(caminhoArquivo));
  await new Promise((resolver) => servidor.listen(0, '127.0.0.1', resolver));
  try {
    await executar(servidor);
  } finally {
    await new Promise((resolver) => servidor.close(resolver));
  }
}

test('consultas, filtros, resumo e respostas de erro', async () => {
  await comServidor(undefined, async (servidor) => {
    const inicio = await consultar(servidor, '/');
    assert.equal(inicio.status, 200);
    assert.match(inicio.dados.nome, /trilhas/);

    const catalogo = await consultar(servidor, '/trilhas');
    assert.equal(catalogo.status, 200);
    assert.equal(catalogo.dados.length, 4);
    assert.deepEqual(catalogo.dados.map((trilha) => trilha.id), [1, 2, 3, 4]);

    const filtro = await consultar(servidor, '/trilhas?dificuldade=facil');
    assert.equal(filtro.status, 200);
    assert.deepEqual(filtro.dados.map((trilha) => trilha.id), [1, 4]);
    assert.equal((await consultar(servidor, '/trilhas?dificuldade=extrema')).status, 400);
    assert.equal((await consultar(servidor, '/trilhas?dificuldade=facil&dificuldade=dificil')).status, 400);

    assert.equal((await consultar(servidor, '/trilhas/2')).dados.nome, 'Subida da Pedra Clara');
    assert.equal((await consultar(servidor, '/trilhas/99')).status, 404);
    assert.equal((await consultar(servidor, '/trilhas/abc')).status, 400);
    assert.equal((await consultar(servidor, '/trilhas/0')).status, 400);
    assert.equal((await consultar(servidor, '/inexistente')).status, 404);

    const metodo = await consultar(servidor, '/trilhas', 'POST');
    assert.equal(metodo.status, 405);
    assert.equal(metodo.allow, 'GET');

    const resumo = await consultar(servidor, '/resumo');
    assert.deepEqual(resumo.dados, {
      quantidade: 4,
      distanciaTotalKm: 25.8,
      porDificuldade: { facil: 2, moderada: 1, dificil: 1 }
    });
    assert.equal((await consultar(servidor, '/trilhas')).status, 200);
  });
});

test('arquivo ausente, JSON inválido, lista vazia e continuidade do servidor', async () => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'trilhas-teste-'));
  const arquivo = path.join(pasta, 'trilhas.json');
  try {
    await comServidor(arquivo, async (servidor) => {
      const ausente = await consultar(servidor, '/trilhas');
      assert.equal(ausente.status, 500);
      assert.deepEqual(ausente.dados, { erro: 'Não foi possível consultar o catálogo.' });

      fs.writeFileSync(arquivo, '{ JSON inválido', 'utf8');
      assert.equal((await consultar(servidor, '/resumo')).status, 500);

      fs.writeFileSync(arquivo, '[]', 'utf8');
      assert.deepEqual((await consultar(servidor, '/trilhas?dificuldade=facil')).dados, []);
      assert.deepEqual((await consultar(servidor, '/resumo')).dados, {
        quantidade: 0,
        distanciaTotalKm: 0,
        porDificuldade: { facil: 0, moderada: 0, dificil: 0 }
      });
    });
  } finally {
    if (fs.existsSync(arquivo)) fs.unlinkSync(arquivo);
    fs.rmdirSync(pasta);
  }
});

test('dados são encontrados fora do diretório do projeto', () => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'trilhas-cwd-'));
  const diretorioAnterior = process.cwd();
  try {
    process.chdir(pasta);
    const { carregarTrilhas } = require('./catalogo');
    assert.equal(carregarTrilhas().length, 4);
  } finally {
    process.chdir(diretorioAnterior);
    fs.rmdirSync(pasta);
  }
});
