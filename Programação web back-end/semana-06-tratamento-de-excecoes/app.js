const { processarPedido } = require('./pedidoService');

const pedidosDeTeste = [
  { titulo: 'Pedido 1: dados validos', produto: 'Mouse', quantidade: 2, saldo: 200 },
  { titulo: 'Pedido 2: produto invalido', produto: 'Monitor', quantidade: 1, saldo: 1000 },
  { titulo: 'Pedido 3: quantidade invalida', produto: 'Teclado', quantidade: 0, saldo: 500 },
  { titulo: 'Pedido 4: saldo insuficiente', produto: 'Notebook', quantidade: 1, saldo: 1000 }
];

function executarPedido(pedido) {
  console.log(`\n=== ${pedido.titulo} ===`);

  try {
    const confirmacao = processarPedido(pedido.produto, pedido.quantidade, pedido.saldo);
    console.log(confirmacao.mensagem);
    console.log(`Produto: ${confirmacao.produto}`);
    console.log(`Quantidade: ${confirmacao.quantidade}`);
    console.log(`Total: R$ ${confirmacao.valorTotal.toFixed(2)}`);
  } catch (erro) {
    if (erro instanceof TypeError) {
      console.log(`Erro de tipo: ${erro.message}`);
    } else if (erro instanceof RangeError) {
      console.log(`Erro de intervalo: ${erro.message}`);
    } else {
      console.log(`Erro ao processar pedido: ${erro.message}`);
    }
  } finally {
    console.log('Processamento do pedido finalizado.');
  }
}

pedidosDeTeste.forEach(executarPedido);
