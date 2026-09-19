# Reserva de Salas

Aplicação de compensação da Semana 05. É uma API original e independente do Coding Dojo da semana: simula reservas de salas de estudo com Node.js e o módulo nativo `http`.

## Objetivo e arquitetura

A aplicação demonstra conceitos server-side estudados até aqui: HTTP, rotas, parâmetro de URL, query string, respostas JSON, cookies e sessões. O arquivo `server.js` recebe a requisição, identifica rota e método, processa os dados e envia a resposta. `salas.js` contém somente as salas fictícias.

Não há banco de dados. As sessões ficam no `Map` `sessoes` em memória. Cada sessão possui sua lista de reservas. Ao criar uma reserva, o servidor consulta todas as sessões para impedir que uma mesma sala seja reservada no mesmo horário.

## Cookies e sessões

Na primeira requisição, o servidor cria um UUID para a sessão e responde com `Set-Cookie: idSessao=...`. O cookie contém somente o identificador; as reservas ficam no servidor. Nas próximas chamadas, o cliente envia `Cookie: idSessao=...`, permitindo recuperar suas reservas.

Como os dados estão em memória, eles são perdidos se o servidor for reiniciado. Isto é adequado apenas para fins didáticos.

## Rotas

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/` | Apresentação da API. |
| GET | `/salas` | Lista todas as salas. |
| GET | `/salas?capacidade=10` | Filtra salas com capacidade mínima de 10. |
| GET | `/salas/:id` | Mostra uma sala, por exemplo `/salas/2`. |
| GET | `/reservas` | Lista somente as reservas da sessão atual. |
| POST | `/reservas` | Cria uma reserva com `salaId` e `horario`. |
| POST | `/reservas/cancelar` | Cancela uma reserva da sessão com `reservaId`. |
| GET | `/sessao` | Mostra dados básicos da sessão atual. |

As respostas são JSON. A API usa 200 para consultas e cancelamentos, 201 para criação, 400 para dados inválidos, 404 para recurso inexistente e 409 para conflito de horário.

## Como executar

Com Node.js instalado, execute no diretório `semana-05`:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3003`.

## Exemplos de utilização

Os comandos abaixo salvam o cookie na primeira chamada e o reutilizam nas demais:

```bash
curl -i -c cookies.txt http://localhost:3003/
curl -b cookies.txt "http://localhost:3003/salas?capacidade=10"
curl -b cookies.txt http://localhost:3003/salas/2
curl -X POST -b cookies.txt -H "Content-Type: application/json" -d '{"salaId":2,"horario":"14:00"}' http://localhost:3003/reservas
curl -b cookies.txt http://localhost:3003/reservas
curl -X POST -b cookies.txt -H "Content-Type: application/json" -d '{"reservaId":1}' http://localhost:3003/reservas/cancelar
```

Exemplo de criação de reserva (HTTP 201):

```json
{
  "mensagem": "Reserva criada com sucesso.",
  "reserva": {
    "id": 1,
    "sala": {
      "id": 2,
      "nome": "Sala de Estudos em Grupo",
      "capacidade": 10,
      "local": "Bloco A - 102"
    },
    "horario": "14:00"
  }
}
```

Caso a sala já esteja reservada no mesmo horário, a resposta é HTTP 409:

```json
{
  "erro": "A sala já está ocupada nesse horário."
}
```
