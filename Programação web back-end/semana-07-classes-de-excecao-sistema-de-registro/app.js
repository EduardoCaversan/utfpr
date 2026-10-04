const { UserRegistry } = require('./userRegistry');
const { ValidationError } = require('./errors/ValidationError');
const { DuplicateUserError } = require('./errors/DuplicateUserError');
const { UnderageUserError } = require('./errors/UnderageUserError');

const registro = new UserRegistry();
const casos = [
  { titulo: 'Registro válido', dados: { nome: 'Ana Souza', email: 'ana@example.com', idade: 22 } },
  { titulo: 'Nome inválido', dados: { nome: ' ', email: 'bruno@example.com', idade: 25 } },
  { titulo: 'E-mail inválido', dados: { nome: 'Bruno Lima', email: 'sem-arroba', idade: 25 } },
  { titulo: 'Idade inválida', dados: { nome: 'Carla Dias', email: 'carla@example.com', idade: '20' } },
  { titulo: 'Usuário menor de idade', dados: { nome: 'Diego Alves', email: 'diego@example.com', idade: 17 } },
  { titulo: 'E-mail duplicado', dados: { nome: 'Ana Silva', email: ' ANA@EXAMPLE.COM ', idade: 30 } },
  { titulo: 'Registro válido após os erros', dados: { nome: 'Eva Costa', email: 'eva@example.com', idade: 18 } }
];

for (const caso of casos) {
  console.log(`\n=== ${caso.titulo} ===`);

  try {
    const usuario = registro.registrar(caso.dados);
    console.log(`Usuário registrado: ${usuario.nome} (${usuario.email}).`);
  } catch (erro) {
    if (erro instanceof ValidationError) {
      console.log(`${erro.name}: ${erro.message} Corrija os dados e tente novamente.`);
    } else if (erro instanceof DuplicateUserError) {
      console.log(`${erro.name}: ${erro.message} Utilize outro e-mail.`);
    } else if (erro instanceof UnderageUserError) {
      console.log(`${erro.name}: ${erro.message} O cadastro não foi autorizado.`);
    } else {
      // Um erro inesperado não deve ser tratado como falha de cadastro prevista.
      throw erro;
    }
  } finally {
    console.log('Tentativa de registro finalizada.');
  }
}

console.log('\nUsuários registrados com sucesso:');
console.table(registro.listar());
