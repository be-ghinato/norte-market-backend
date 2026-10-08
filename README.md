# API Norte Market - Backend

Projeto integrador da disciplina Programação III - AV1 2026/2.

## Integrantes do Grupo
- Nome do Integrante 1
- Nome do Integrante 2
- Nome do Integrante 3

## Endpoints

| VERBO | ENDPOINT (URL) | AÇÃO EXECUTADA |
|-------|----------------|----------------|
| GET   | /api/products  | Retorna a lista de todos os produtos em JSON |
| GET   | /api/products/:id | Retorna um produto específico pelo ID |
| POST  | /api/products   | Cria um novo produto (dados no corpo da requisição em JSON) |

## Instruções para rodar a API

1. Instalar as dependências:
   ```bash
   npm install
   ```

2. Iniciar o servidor:
   ```bash
   npm start
   ```

3. O servidor estará disponível em: `http://localhost:3000`

## Rotas disponíveis

- `GET  /` - Mensagem de boas-vindas
- `GET  /api/products` - Lista todos os produtos
- `GET  /api/products/:id` - Retorna um produto pelo ID
- `POST /api/products` - Cria um novo produto

## Versionamento

- Repositório PÚBLICO no GitHub
- Cada integrante do grupo deve fazer pelo menos 1 commit com a própria conta do GitHub (nome e e-mail configurados no `git config`)
- O nome de cada integrante deve aparecer no histórico de commits do repositório