const { ValidationError } = require('./errors/ValidationError');
const { DuplicateUserError } = require('./errors/DuplicateUserError');
const { UnderageUserError } = require('./errors/UnderageUserError');

const IDADE_MINIMA = 18;

class UserRegistry {
  #usuarios = [];

  registrar(dados) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
      throw new ValidationError('Informe os dados do usuário em um objeto.');
    }

    const { nome, email, idade } = dados;

    if (typeof nome !== 'string' || nome.trim() === '') {
      throw new ValidationError('O nome deve ser um texto não vazio.');
    }

    // Validação simplificada, adequada ao exemplo didático.
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new ValidationError('Informe um e-mail válido.');
    }

    if (!Number.isInteger(idade) || idade < 0) {
      throw new ValidationError('A idade deve ser um número inteiro não negativo.');
    }

    if (idade < IDADE_MINIMA) {
      throw new UnderageUserError(`O registro exige idade mínima de ${IDADE_MINIMA} anos.`);
    }

    const emailNormalizado = email.trim().toLowerCase();

    if (this.#usuarios.some((usuario) => usuario.email === emailNormalizado)) {
      throw new DuplicateUserError(`O e-mail ${emailNormalizado} já está registrado.`);
    }

    const usuario = { nome: nome.trim(), email: emailNormalizado, idade };
    this.#usuarios.push(usuario);
    return { ...usuario };
  }

  listar() {
    return this.#usuarios.map((usuario) => ({ ...usuario }));
  }
}

module.exports = { UserRegistry, IDADE_MINIMA };
