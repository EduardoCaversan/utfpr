# Biblioteca HTTP

Aplicação prática da Semana 01 de Desenvolvimento Web: uma pequena API de consulta de biblioteca construída com Node.js e o módulo nativo `http`.

## Objetivo

Demonstrar a arquitetura HTTP cliente-servidor. Um cliente, como navegador, `curl` ou Postman, envia uma requisição HTTP para o servidor. O servidor identifica o método e a URL solicitada, processa a rota e devolve uma resposta HTTP com código de status, cabeçalhos e conteúdo.

Nesta aplicação, os dados ficam apenas na memória do servidor. Não são usados Express, banco de dados, JWT, ORM ou dependências externas.

## Como executar

Pré-requisito: Node.js atual instalado (Node.js 18 ou superior recomendado).

```bash
cd semana-01
npm start
```

O servidor será iniciado em `http://localhost:3000`.

Para usar outra porta no PowerShell:

```powershell
$env:PORT=3333; npm start
```

## Rotas disponíveis

| Método | Rota | Resposta |
| --- | --- | --- |
| GET | `/` | Mensagem confirmando que o servidor funciona. |
| GET | `/livros` | Lista de livros fictícios em JSON. |
| GET | `/biblioteca` | Informações básicas da biblioteca em JSON. |
| GET | `/status` | Estado atual do servidor em JSON. |
| GET | qualquer outra | Erro 404 em JSON. |

O servidor também registra no terminal o método e a rota de cada requisição recebida.

## Exemplos de requisições

Com o servidor em execução, use outro terminal:

```bash
curl http://localhost:3000/
curl http://localhost:3000/livros
curl http://localhost:3000/biblioteca
curl http://localhost:3000/status
curl -i http://localhost:3000/rota-inexistente
```

No PowerShell, `curl.exe` evita que o apelido `curl` do sistema altere o resultado:

```powershell
curl.exe http://localhost:3000/livros
```

## Exemplos de respostas

`GET /` responde com status `200 OK` e texto simples:

```text
Servidor da Biblioteca HTTP está funcionando.
```

`GET /livros` responde com status `200 OK` e JSON:

```json
{
  "livros": [
    {
      "id": 1,
      "titulo": "O Caminho das Estrelas",
      "autor": "Marina Campos",
      "disponivel": true
    }
  ]
}
```

Uma rota inexistente, como `GET /autores`, responde com status `404 Not Found`:

```json
{
  "erro": "Rota não encontrada",
  "mensagem": "Não existe uma rota GET para /autores."
}
```

## Estrutura

```text
semana-01/
├── package.json
├── README.md
└── server.js
```
