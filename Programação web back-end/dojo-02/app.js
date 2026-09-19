const express = require('express');
const _ = require('lodash');
const operacoes = require('./operacoes');

const app = express();
const porta = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log(operacoes.adicao(8, 4));
console.log(operacoes.subtracao(15, 7));
console.log(operacoes.multiplicacao(6, 3));
console.log(operacoes.divisao(20, 5));
console.log(operacoes.divisao(10, 0));
console.log(_.random(1, 30));

app.get('/adicao', (req, res) => {
  res.send('Você esta na rota adição');
});

app.post('/adicao', (req, res) => {
  res.send(String(operacoes.adicao(req.body.a, req.body.b)));
});

app.get('/subtracao', (req, res) => {
  res.send('Você esta na rota subtração');
});

app.post('/subtracao', (req, res) => {
  res.send(String(operacoes.subtracao(req.body.a, req.body.b)));
});

app.get('/multiplicacao', (req, res) => {
  res.send('Você esta na rota multiplicação');
});

app.post('/multiplicacao', (req, res) => {
  res.send(String(operacoes.multiplicacao(req.body.a, req.body.b)));
});

app.get('/divisao', (req, res) => {
  res.send('Você esta na rota divisão');
});

app.post('/divisao', (req, res) => {
  res.send(String(operacoes.divisao(req.body.a, req.body.b)));
});

app.listen(porta, () => {
  console.log(`Servidor executando em http://localhost:${porta}`);
});
