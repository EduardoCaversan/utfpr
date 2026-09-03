const usuarios = [
  { nome: "Ana", idade: 20, ativo: true, compras: [100, 50, 25] },
  { nome: "Bruno", idade: 17, ativo: false, compras: [30, 20] },
  { nome: "Carlos", idade: 32, ativo: true, compras: [200, 150, 50, 100] },
  { nome: "Diana", idade: 25, ativo: true, compras: [] },
  { nome: "Eduardo", idade: 15, ativo: false, compras: [10] }
];

// ========================================
// PARTE 1 - Total de compras por usuário
// ========================================

console.log("=== PARTE 1 ===");

usuarios.forEach(usuario => {
  const total = usuario.compras.reduce(
    (soma, compra) => soma + compra,
    0
  );

  console.log(`${usuario.nome}: total = ${total}`);
});


// ========================================
// PARTE 2 - Usuários ativos
// ========================================

console.log("\n=== PARTE 2 ===");

const usuariosAtivos = usuarios.filter(
  usuario => usuario.ativo
);

usuariosAtivos.forEach(usuario => {
  console.log(usuario.nome);
});


// ========================================
// PARTE 3 - Usuários maiores de idade
// ========================================

console.log("\n=== PARTE 3 ===");

const maioresDeIdade = usuarios.filter(
  usuario => usuario.idade >= 18
);

maioresDeIdade.forEach(usuario => {
  console.log(usuario.nome);
});


// ========================================
// PARTE 4 - Maior comprador
// ========================================

console.log("\n=== PARTE 4 ===");

const maiorComprador = usuarios.reduce((maior, usuario) => {
  const totalAtual = usuario.compras.reduce(
    (soma, compra) => soma + compra,
    0
  );

  const totalMaior = maior.compras.reduce(
    (soma, compra) => soma + compra,
    0
  );

  return totalAtual > totalMaior ? usuario : maior;
});

const totalMaiorComprador = maiorComprador.compras.reduce(
  (soma, compra) => soma + compra,
  0
);

console.log("Usuário com maior volume:", maiorComprador.nome);
console.log("Total:", totalMaiorComprador);


// ========================================
// PARTE 5 - Coerção de tipos
// ========================================

console.log("\n=== PARTE 5 ===");

console.log("5" + 2);      // "52"
console.log("5" - 2);      // 3
console.log(true + 1);     // 2
console.log(false == 0);   // true
console.log(false === 0);  // false


// ========================================
// PARTE 6 - this
// ========================================

console.log("\n=== PARTE 6 ===");

const pessoa = {
  nome: "Maria",

  falar: function() {
    console.log(this.nome);
  }
};

pessoa.falar(); // Maria


// ========================================
// PARTE 7 - Gerar relatório
// ========================================

console.log("\n=== PARTE 7 ===");

const gerarRelatorio = usuarios => {
  const totalUsuarios = usuarios.length;

  const usuariosAtivos = usuarios.filter(
    usuario => usuario.ativo
  ).length;

  const usuariosInativos = usuarios.filter(
    usuario => !usuario.ativo
  ).length;

  const somaIdades = usuarios.reduce(
    (soma, usuario) => soma + usuario.idade,
    0
  );

  const mediaIdade = somaIdades / totalUsuarios;

  const maiorComprador = usuarios.reduce((maior, usuario) => {
    const totalAtual = usuario.compras.reduce(
      (soma, compra) => soma + compra,
      0
    );

    const totalMaior = maior.compras.reduce(
      (soma, compra) => soma + compra,
      0
    );

    return totalAtual > totalMaior ? usuario : maior;
  });

  return {
    totalUsuarios,
    usuariosAtivos,
    usuariosInativos,
    mediaIdade,
    maiorComprador: maiorComprador.nome
  };
};

console.log(gerarRelatorio(usuarios));


// ========================================
// DESAFIO EXTRA
// ========================================

console.log("\n=== DESAFIO EXTRA ===");

const gerarExtra = usuarios => {
  const maisJovem = usuarios.reduce(
    (jovem, usuario) =>
      usuario.idade < jovem.idade ? usuario : jovem
  );

  const maisVelho = usuarios.reduce(
    (velho, usuario) =>
      usuario.idade > velho.idade ? usuario : velho
  );

  const totalCompras = usuarios.reduce(
    (total, usuario) =>
      total +
      usuario.compras.reduce(
        (soma, compra) => soma + compra,
        0
      ),
    0
  );

  const mediaComprasPorUsuario =
    totalCompras / usuarios.length;

  return {
    maisJovem: maisJovem.nome,
    maisVelho: maisVelho.nome,
    mediaComprasPorUsuario
  };
};

console.log(gerarExtra(usuarios));
