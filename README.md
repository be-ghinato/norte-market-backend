# API Norte Market - Backend

Projeto integrador da disciplina Programação III - AV1 2026/2.

## Integrantes do Grupo
- Bernardo Ghinato Goelzer
- Bruna Muraro

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