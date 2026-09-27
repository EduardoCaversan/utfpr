# Semana 6 — Tratamento de Exceções

## Objetivo

Esta atividade demonstra o tratamento de exceções em Node.js com lançamento, captura e tipos diferentes de erro.

## Cenário

Uma loja fictícia processa pedidos de Notebook, Mouse e Teclado. Cada pedido valida o produto, a quantidade e o saldo disponível.

## Conceitos utilizados

- `try`
- `catch`
- `finally`
- `throw`
- `Error`
- `TypeError`
- `RangeError`
- propagação de exceções

O arquivo `pedidoService.js` detecta os problemas e lança as exceções. O `app.js` recebe essas exceções e as trata no `catch`.

## Como executar

Não há dependências externas. O comando `npm install` é opcional e não instala bibliotecas.

```bash
cd semana-06-tratamento-de-excecoes
npm install
npm start
```
