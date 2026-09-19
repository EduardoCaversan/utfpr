# Carrinho por Sessão

Aplicação prática da Semana 04, sobre cookies e sessões. Ela simula um carrinho de compras pequeno com Node.js e o módulo nativo `http`, sem Express, banco de dados ou bibliotecas de sessão.

## Objetivo e conceitos

Um **cookie** é um pequeno valor que o servidor envia ao cliente pelo header `Set-Cookie`. Nas próximas requisições, o cliente devolve esse valor no header `Cookie`.

Uma **sessão** são os dados que o servidor mantém associados a um cliente. Nesta aplicação, o cookie possui somente um identificador chamado `idSessao`. O carrinho e a data de criação ficam no `Map` `sessoes`, em memória no servidor. Portanto, cookie não é o carrinho: ele é a chave usada para localizar o carrinho no servidor.

Essa implementação é didática. Em produção, sessões costumam ser persistidas em banco de dados, cache ou serviço próprio, e precisam de políticas adicionais de segurança e expiração.

## Fluxo da sessão

Na primeira requisição, `obterSessao` procura `idSessao` no header `Cookie`. Como ele não existe, o servidor cria um UUID, adiciona uma sessão com carrinho vazio ao `Map` e responde com `Set-Cookie`.

Nas requisições seguintes, o cliente envia `Cookie: idSessao=...`. A função lê esse header, encontra a chave no `Map` e recupera o mesmo carrinho. Assim, os itens permanecem entre requisições do mesmo cliente.

## Rotas

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/` | Apresenta a API. |
| GET | `/produtos` | Lista os produtos fictícios. |
| POST | `/carrinho/adicionar` | Adiciona um produto à sessão atual. |
| GET | `/carrinho` | Mostra o carrinho da sessão atual. |
| POST | `/carrinho/limpar` | Remove todos os itens do carrinho atual. |
| GET | `/sessao` | Mostra informações básicas, sem retornar o identificador. |

## Como executar

Com Node.js instalado, no diretório `semana-04` execute:

```bash
npm start
```

O servidor estará em `http://localhost:3002`.

## Exemplos de uso

O `-c cookies.txt` salva o cookie recebido, e `-b cookies.txt` o envia nas chamadas seguintes:

```bash
curl -i -c cookies.txt http://localhost:3002/
curl -b cookies.txt http://localhost:3002/produtos
curl -X POST -b cookies.txt -H "Content-Type: application/json" -d '{"produtoId":1}' http://localhost:3002/carrinho/adicionar
curl -b cookies.txt http://localhost:3002/carrinho
curl -X POST -b cookies.txt http://localhost:3002/carrinho/limpar
curl -b cookies.txt http://localhost:3002/sessao
```

Exemplo de resposta após adicionar um item (HTTP 201):

```json
{
  "mensagem": "Produto adicionado ao carrinho da sessão.",
  "produto": {
    "id": 1,
    "nome": "Caderno universitário",
    "preco": 18.5
  }
}
```
