const produtos = [
  { nome: 'Notebook', preco: 2500 },
  { nome: 'Mouse', preco: 80 },
  { nome: 'Teclado', preco: 150 }
];

function buscarProduto(nomeProduto) {
  if (typeof nomeProduto !== 'string' || nomeProduto.trim() === '') {
    throw new TypeError('Informe o nome de um produto.');
  }

  const produto = produtos.find((item) => (
    item.nome.toLowerCase() === nomeProduto.trim().toLowerCase()
  ));

  if (!produto) {
    throw new TypeError(`O produto "${nomeProduto}" nao esta disponivel.`);
  }

  return produto;
}

function validarQuantidade(quantidade) {
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new RangeError('A quantidade deve ser um numero inteiro maior que zero.');
  }
}

function processarPedido(produto, quantidade, saldo) {
  const produtoEscolhido = buscarProduto(produto);
  validarQuantidade(quantidade);

  if (typeof saldo !== 'number' || Number.isNaN(saldo)) {
    throw new TypeError('O saldo deve ser informado como numero.');
  }

  const valorTotal = produtoEscolhido.preco * quantidade;

  if (saldo < valorTotal) {
    throw new Error(
      `Saldo insuficiente. O pedido custa R$ ${valorTotal.toFixed(2)} e o saldo e R$ ${saldo.toFixed(2)}.`
    );
  }

  return {
    mensagem: 'Pedido processado com sucesso.',
    produto: produtoEscolhido.nome,
    quantidade,
    valorTotal
  };
}

module.exports = { processarPedido };
