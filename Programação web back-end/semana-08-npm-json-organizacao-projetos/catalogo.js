const fs = require('node:fs');
const path = require('node:path');

const CAMINHO_DADOS = path.join(__dirname, 'dados', 'trilhas.json');
const DIFICULDADES = ['facil', 'moderada', 'dificil'];

function carregarTrilhas(caminhoArquivo = CAMINHO_DADOS) {
  // O arquivo é lido em cada consulta para tornar visível a conversão de JSON.
  const texto = fs.readFileSync(caminhoArquivo, 'utf8');
  const trilhas = JSON.parse(texto);

  if (!Array.isArray(trilhas) || !trilhas.every((trilha) =>
    Number.isSafeInteger(trilha.id) && trilha.id > 0 &&
    typeof trilha.nome === 'string' && trilha.nome.trim() !== '' &&
    DIFICULDADES.includes(trilha.dificuldade) &&
    typeof trilha.distanciaKm === 'number' && Number.isFinite(trilha.distanciaKm) && trilha.distanciaKm > 0 &&
    typeof trilha.local === 'string' && trilha.local.trim() !== '')) {
    throw new Error('Dados de trilhas inválidos.');
  }

  return trilhas;
}

function resumirTrilhas(trilhas) {
  const porDificuldade = { facil: 0, moderada: 0, dificil: 0 };
  let distanciaTotalKm = 0;

  for (const trilha of trilhas) {
    porDificuldade[trilha.dificuldade]++;
    distanciaTotalKm += trilha.distanciaKm;
  }

  return {
    quantidade: trilhas.length,
    distanciaTotalKm: Number(distanciaTotalKm.toFixed(2)),
    porDificuldade
  };
}

module.exports = { carregarTrilhas, resumirTrilhas, DIFICULDADES };
