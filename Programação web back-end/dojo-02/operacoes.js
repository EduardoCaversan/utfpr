function adicao(a, b) {
  return Number(a) + Number(b);
}

function subtracao(a, b) {
  return Number(a) - Number(b);
}

function multiplicacao(a, b) {
  return Number(a) * Number(b);
}

function divisao(a, b) {
  if (Number(b) === 0) {
    return 'Erro: divisão por zero!';
  }

  return Number(a) / Number(b);
}

module.exports = {
  adicao,
  subtracao,
  multiplicacao,
  divisao
};
