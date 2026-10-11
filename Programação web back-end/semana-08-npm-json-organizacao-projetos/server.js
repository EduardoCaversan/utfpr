const http = require('node:http');
const { criarApp } = require('./app');

const porta = process.env.PORT || 3000;
const servidor = http.createServer(criarApp());

servidor.listen(porta, () => {
  console.log(`Catálogo disponível em http://localhost:${servidor.address().port}`);
});
