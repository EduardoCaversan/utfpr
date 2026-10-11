# Semana 8 — NPM, JSON e Organização de Projetos

## Objetivo e cenário

Organizar uma pequena API Node.js que consulta trilhas de caminhada fictícias. O catálogo vem de um arquivo JSON; a aplicação não grava dados.

Referência de conteúdo: capítulo [“NPM, JSON e organização de projetos Node JS”](https://costasilvati.github.io/IntroNodeJS/) do livro *Introdução ao Node.js* ([texto-fonte do capítulo](https://github.com/costasilvati/IntroNodeJS/blob/main/07-npm-JSON.Rmd)). A referência apresenta o assunto, sem estabelecer datas da disciplina.

## Conceitos no código

| Conceito | Onde aparece |
| --- | --- |
| NPM e scripts `start`, `dev`, `test` | `package.json` |
| Dependência de desenvolvimento `nodemon` | `package.json` e `package-lock.json` |
| Leitura com `node:fs` e caminho baseado em `__dirname` | `catalogo.js` |
| Texto JSON convertido em objetos com `JSON.parse()` | `catalogo.js`, após a leitura de `dados/trilhas.json` |
| Objetos convertidos em respostas JSON com `JSON.stringify()` | `app.js`, na função `responder` |
| Módulos CommonJS (`require()` e `module.exports`) | `catalogo.js`, `app.js` e `server.js` |
| Falhas de leitura, JSON inválido e dados malformados | `catalogo.js` lança o erro; `app.js` responde 500 sem detalhes internos |

O arquivo contém **texto JSON**, que precisa ser lido e interpretado por `JSON.parse()` para virar uma lista de objetos JavaScript. Para responder pela rede, `JSON.stringify()` transforma esses objetos novamente em texto JSON.

`package.json` descreve o projeto, seus comandos e dependências. `package-lock.json` registra as versões exatas instaladas, permitindo reproduzir a instalação. `node_modules/` recebe os pacotes instalados e não é versionado. A API usa apenas módulos nativos do Node.js em execução, portanto não precisa de `dependencies`. `nodemon` fica em `devDependencies`: reinicia o servidor ao editar arquivos durante o desenvolvimento e não é necessário para `npm start`.

## Executar

Requisito: Node.js 18 ou superior. No terminal, a partir da raiz do repositório:

```powershell
cd 'Programação web back-end/semana-08-npm-json-organizacao-projetos'
npm install
npm start
```

O servidor usa a porta 3000. Em outro terminal, para reinício automático durante o desenvolvimento:

```powershell
cd 'Programação web back-end/semana-08-npm-json-organizacao-projetos'
npm run dev
```

Execute `npm start` **ou** `npm run dev` por vez. Para verificar os comportamentos:

```powershell
npm test
```

## Rotas

| Método e rota | Resultado |
| --- | --- |
| `GET /` | Apresentação e rotas disponíveis (200) |
| `GET /trilhas` | Lista completa (200) |
| `GET /trilhas?dificuldade=facil` | Lista filtrada; sem correspondências, `[]` (200) |
| `GET /trilhas/2` | Trilha com identificador 2 (200) |
| `GET /resumo` | Quantidade, distância total e contagem por dificuldade (200) |

Exemplos no PowerShell:

```powershell
curl.exe http://localhost:3000/trilhas
curl.exe 'http://localhost:3000/trilhas?dificuldade=facil'
curl.exe http://localhost:3000/trilhas/2
curl.exe http://localhost:3000/resumo
```

O resumo dos dados de exemplo tem 4 trilhas, 25,8 km no total e contagens `facil: 2`, `moderada: 1`, `dificil: 1`. Dificuldade ou identificador inválido retorna 400; trilha ou rota inexistente retorna 404; outro método em uma rota existente retorna 405; falha interna ao ler ou interpretar o arquivo retorna 500.

## Limitações

Os dados são fictícios e de consulta apenas. O arquivo é lido a cada requisição para evidenciar a leitura e a conversão de JSON; não há cache nem persistência de alterações. A validação do arquivo cobre os campos principais, sem pretender ser um esquema completo.
