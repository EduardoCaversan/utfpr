# Agenda de Eventos

Aplicação prática da Semana 03 da disciplina de Desenvolvimento Web. A API consulta eventos fictícios e foi criada apenas com Node.js e o módulo nativo `http`, sem Express ou banco de dados.

## Objetivo

Demonstrar programação server-side: o servidor recebe uma requisição HTTP, identifica a rota e o método, processa os dados necessários, monta uma resposta JSON e a envia ao cliente com o status e o `Content-Type` adequados.

Os dados ficam em `eventos.js`. Assim, `server.js` concentra a lógica do servidor: `http.createServer` recebe `requisicao` e `resposta`; a URL é interpretada; as condições escolhem a rota; e a função `enviarJson` define o status, o header `Content-Type: application/json` e o conteúdo enviado.

## Rotas disponíveis

| Método | Rota | Resposta |
| --- | --- | --- |
| GET | `/` | Apresentação da API |
| GET | `/eventos` | Todos os eventos |
| GET | `/eventos/hoje` | Eventos marcados como hoje |
| GET | `/eventos/futuros` | Eventos marcados como futuros |
| GET | `/evento/:id` | Um evento pelo ID, como `/evento/1` |
| GET | `/sobre` | Informações sobre a aplicação |

As consultas corretas retornam HTTP 200. Uma rota inexistente ou um ID não encontrado retorna HTTP 404 com uma mensagem JSON.

## Como executar

Com Node.js instalado, entre na pasta `semana-03` e execute:

```bash
npm start
```

O servidor ficará disponível em `http://localhost:3001`.

## Exemplos

```bash
curl http://localhost:3001/eventos
curl http://localhost:3001/eventos/hoje
curl http://localhost:3001/eventos/futuros
curl http://localhost:3001/evento/1
curl http://localhost:3001/sobre
```

Exemplo de `GET /evento/1` (HTTP 200):

```json
{
  "id": 1,
  "titulo": "Oficina de Currículo",
  "local": "Sala de Projetos",
  "horario": "10:00",
  "periodo": "hoje"
}
```

Exemplo de evento inexistente, em `GET /evento/99` (HTTP 404):

```json
{
  "erro": "Evento não encontrado."
}
```
