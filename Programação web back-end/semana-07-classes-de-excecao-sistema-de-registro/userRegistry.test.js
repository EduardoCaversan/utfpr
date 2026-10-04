const test = require('node:test');
const assert = require('node:assert/strict');
const { UserRegistry } = require('./userRegistry');
const { ValidationError } = require('./errors/ValidationError');
const { DuplicateUserError } = require('./errors/DuplicateUserError');
const { UnderageUserError } = require('./errors/UnderageUserError');

const valido = { nome: ' Ana Souza ', email: ' ANA@EXAMPLE.COM ', idade: 18 };

function verificarErro(registro, dados, Tipo) {
  assert.throws(() => registro.registrar(dados), (erro) => {
    assert.ok(erro instanceof Tipo);
    assert.ok(erro instanceof Error);
    assert.equal(erro.name, Tipo.name);
    assert.ok(erro.message.length > 0);
    return true;
  });
}

test('registra na idade mínima e normaliza nome/e-mail', () => {
  const registro = new UserRegistry();
  const usuario = registro.registrar(valido);
  assert.deepEqual(usuario, { nome: 'Ana Souza', email: 'ana@example.com', idade: 18 });
  assert.deepEqual(registro.listar(), [usuario]);
});

test('dados ausentes ou inválidos lançam ValidationError sem registrar', () => {
  const registro = new UserRegistry();
  const invalidos = [undefined, null, [], 'texto', {},
    ...[undefined, null, '', ' ', 123].map((nome) => ({ ...valido, nome })),
    ...[undefined, null, '', 'ana', 'a@@b.com', 'a b@c.com', 123].map((email) => ({ ...valido, email })),
    ...[undefined, null, '18', -1, 18.5, NaN, Infinity].map((idade) => ({ ...valido, idade }))
  ];
  for (const dados of invalidos) verificarErro(registro, dados, ValidationError);
  assert.deepEqual(registro.listar(), []);
});

test('idades válidas abaixo de 18 lançam UnderageUserError', () => {
  const registro = new UserRegistry();
  for (const idade of [0, 17]) verificarErro(registro, { ...valido, idade }, UnderageUserError);
  assert.deepEqual(registro.listar(), []);
});

test('duplicidade ignora caixa/espaços e permite novo cadastro após falhas', () => {
  const registro = new UserRegistry();
  registro.registrar(valido);
  verificarErro(registro, { ...valido, email: 'ana@example.com' }, DuplicateUserError);
  verificarErro(registro, { ...valido, email: ' Ana@Example.Com ' }, DuplicateUserError);
  verificarErro(registro, { ...valido, nome: '' }, ValidationError);
  registro.registrar({ nome: 'Eva Costa', email: 'eva@example.com', idade: 22 });
  assert.equal(registro.listar().length, 2);
  assert.equal(registro.listar()[1].nome, 'Eva Costa');
});

test('alterar valores retornados não modifica os registros internos', () => {
  const registro = new UserRegistry();
  const usuario = registro.registrar(valido);
  usuario.email = 'outro@example.com';
  const lista = registro.listar();
  lista[0].nome = 'Alterado';
  lista.push({ nome: 'Outro' });
  assert.deepEqual(registro.listar(), [{ nome: 'Ana Souza', email: 'ana@example.com', idade: 18 }]);
});
