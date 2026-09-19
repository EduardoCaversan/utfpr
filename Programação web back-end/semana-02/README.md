# Rastreamento de Encomendas

Aplicação prática da Semana 02, sobre HTTP: headers, parâmetros e CGI. É uma pequena API feita somente com Node.js e o módulo nativo `http`, sem Express e sem banco de dados. Ela consulta e cadastra encomendas fictícias mantidas em memória.

## Conceitos demonstrados

- **Requisições e métodos HTTP:** as rotas usam `GET` para consulta e `POST` para cadastro.
- **Headers:** `GET /cabecalhos` mostra os headers `User-Agent`, `Accept` e `Host` enviados pelo cliente. As respostas JSON também definem o header `Content-Type`.
- **Parâmetros de URL:** em `GET /encomendas/:codigo`, o código é lido diretamente do caminho, por exemplo `/encomendas/BR123`.
- **Query strings:** `GET /buscar?status=entregue` obtém `status` com `url.searchParams` e filtra a lista.
- **Processamento de requisições:** o `POST /encomendas` lê o corpo recebido, interpreta JSON, valida os campos e adiciona a encomenda à lista em memória.
- **Respostas HTTP:** a API usa 200 (sucesso), 201 (criação), 400 (requisição inválida) e 404 (não encontrado).

## Como executar

É necessário ter o Node.js instalado. No diretório `semana-02`, execute:

```bash
npm start
```

O servidor ficará disponível em `http://localhost:3000`.

## Chamadas e respostas de exemplo

```bash
curl http://localhost:3000/
curl http://localhost:3000/encomendas
curl http://localhost:3000/encomendas/BR123
curl "http://localhost:3000/buscar?status=entregue"
curl http://localhost:3000/cabecalhos
```

Exemplo de resposta de `GET /encomendas/BR123` (200):

```json
{
  "codigo": "BR123",
  "destinatario": "Ana Souza",
  "status": "em trânsito",
  "cidade": "Curitiba"
}
```

Para cadastrar uma encomenda:

```bash
curl -X POST http://localhost:3000/encomendas \
  -H "Content-Type: application/json" \
  -d '{"codigo":"BR999","destinatario":"Diego Alves","status":"postado","cidade":"Maringá"}'
```

Resposta esperada (201):

```json
{
  "mensagem": "Encomenda cadastrada com sucesso.",
  "encomenda": {
    "codigo": "BR999",
    "destinatario": "Diego Alves",
    "status": "postado",
    "cidade": "Maringá"
  }
}
```

Se o corpo estiver incompleto ou não for JSON válido, a API responde 400. Uma encomenda com código inexistente e uma rota inexistente respondem 404.
