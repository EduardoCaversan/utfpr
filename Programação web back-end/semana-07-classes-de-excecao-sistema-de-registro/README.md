# Semana 7 — Classes de Exceção e Sistema de Registro

## Objetivo

Dar continuidade à Semana 06, agora criando classes personalizadas que herdam de `Error` e tratando cada tipo de exceção de forma específica.

## Cenário

Um pequeno sistema registra usuários com nome, e-mail e idade. O cadastro exige idade mínima de 18 anos e impede e-mails duplicados, desconsiderando maiúsculas e espaços nas extremidades. Os registros ficam em memória e são perdidos ao encerrar a execução.

## Conceitos utilizados

- Classes personalizadas de exceção e herança de `Error`.
- `super(message)` e propriedade `name` para identificar o erro.
- `throw` e propagação: `userRegistry.js` lança a exceção, que chega ao consumidor em `app.js`.
- `try`, `catch` e `instanceof` para capturar e tratar cada tipo.
- `finally` para finalizar cada tentativa, com sucesso ou falha.

| Exceção | Quando é lançada | Tratamento na demonstração |
| --- | --- | --- |
| `ValidationError` | Dados ausentes, nome/e-mail inválidos ou idade não inteira/não negativa. | Orientar a correção dos dados. |
| `DuplicateUserError` | E-mail já registrado. | Orientar o uso de outro e-mail. |
| `UnderageUserError` | Idade válida, mas inferior a 18 anos. | Informar que o cadastro não foi autorizado. |

Um `Error` genérico informa uma falha; essas subclasses também representam sua categoria, permitindo tratamentos diferentes com `instanceof`. Erros inesperados são relançados.

## Como executar

Pré-requisito: Node.js 18 ou superior. Não há dependências externas; `npm install` é opcional.

```bash
cd semana-07-classes-de-excecao-sistema-de-registro
npm install
npm start
npm test
```

A demonstração executa sete tentativas: cadastro válido, nome inválido, e-mail inválido, idade inválida, menor de idade, duplicidade e outro cadastro válido após os erros. Ao final, a tabela deve conter apenas Ana e Eva.

Os testes usam `node:test` e `node:assert/strict`, nativos do Node.js, para verificar validação, tipos de exceção, limites de idade, duplicidade e preservação dos registros após falhas.

## Estrutura

- `errors/`: três classes que estendem `Error`.
- `userRegistry.js`: validação e armazenamento dos registros.
- `app.js`: demonstração e tratamento das exceções.
- `userRegistry.test.js`: verificação dos comportamentos.
- `package.json` e `package-lock.json`: configuração de execução.
