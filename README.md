# API Norte Market - Backend

Projeto integrador da disciplina Programação III - AV1 2026/2.

## Integrantes do Grupo
- Bernardo Ghinato Goelzer
- Bruna Muraro

## Tecnologias
- Node.js + Express
- PostgreSQL (via `pg`) — com fallback em arquivo JSON (`data/db.json`) para ambiente local sem banco configurado
- Autenticação: JWT (`jsonwebtoken`)
- Hash de senha: bcrypt (`bcryptjs`)
- Validação: Joi (`joi`)
- Variáveis de ambiente: `dotenv`
- CORS: `cors`

## Estrutura MVC

```
server.js                      # ponto de entrada
src/
  config/
    db.js                      # conexão com o banco (PostgreSQL ou arquivo)
    auth.js                    # segredos JWT / bcrypt
  models/
    User.js                    # camada de dados: usuários
    Product.js                 # camada de dados: produtos
    Order.js                   # camada de dados: pedidos
  controllers/
    authController.js          # register, login, me
    productController.js       # CRUD produtos
    orderController.js         # CRUD pedidos
    userController.js          # CRUD usuários (admin)
  routes/
    authRoutes.js
    productRoutes.js
    orderRoutes.js
    userRoutes.js
  middleware/
    authMiddleware.js          # authenticateToken, isAdmin, generateToken
    validateMiddleware.js      # validação Joi
  validations/
    schemas.js                 # schemas Joi
  seeds/
    seed.js                    # popula dados reais
data/
  db.json                      # banco local (arquivo) — gerado pelo seed
.env.example                   # exemplo de variáveis de ambiente
Norte-Market.postman_collection.json   # coleção Postman
```

## Segurança
- **Joi**: validação de entrada em todas as rotas de criação/atualização (400 com detalhes quando inválido).
- **bcrypt**: senhas armazenadas com hash (salt rounds configurável), nunca em texto puro.
- **JWT**: tokens assinados expirarem em 7 dias; rotas protegidas via middleware `authenticateToken`; rotas administrativas via `isAdmin`.
- Senha nunca é retornada nas respostas (`auth/me` remove o hash).

## Variáveis de ambiente (`.env`)
Copie `.env.example` para `.env` e ajuste:

```
PORT=3000
# Banco PostgreSQL no Render (deixe comentado para usar arquivo local)
# DATABASE_URL=postgresql://user:pass@host:5432/db
# DB_SSL=false

JWT_SECRET=norte-market-secret-dev
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

## Rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar .env a partir do exemplo
copy .env.example .env   (Windows)
# ou
cp .env.example .env     (Linux/Mac)

# 3. Popular o banco com dados reais
npm run seed

# 4. Iniciar o servidor
npm start

# API disponível em: http://localhost:3000
```

## Credenciais de demonstração (criadas pelo `npm run seed`)

| Tipo | E-mail | Senha | Perfil |
|------|--------|-------|--------|
| Admin | admin@nortemarket.com | admin123 | admin |
| Cliente | cliente@nortemarket.com | cliente123 | customer |

## Endpoints

### Autenticação (`/api/auth`)
| Verbo | Endpoint | Descrição | Acesso |
|-------|----------|-----------|--------|
| POST | `/api/auth/register` | Cadastra usuário | público |
| POST | `/api/auth/login` | Retorna token JWT | público |
| GET | `/api/auth/me` | Dados do usuário logado | JWT |

### Produtos (`/api/products`)
| Verbo | Endpoint | Descrição | Acesso |
|-------|----------|-----------|--------|
| GET | `/api/products` | Lista produtos | público |
| GET | `/api/products/:id` | Produto por ID | público |
| POST | `/api/products` | Cria produto | admin + JWT |
| PUT | `/api/products/:id` | Atualiza produto | admin + JWT |
| DELETE | `/api/products/:id` | Remove produto | admin + JWT |

### Pedidos (`/api/orders`)
| Verbo | Endpoint | Descrição | Acesso |
|-------|----------|-----------|--------|
| GET | `/api/orders` | Lista todos os pedidos | admin + JWT |
| GET | `/api/orders/me` | Pedidos do usuário logado | JWT |
| GET | `/api/orders/:id` | Pedido por ID | JWT |
| POST | `/api/orders` | Cria pedido | JWT |
| PUT | `/api/orders/:id/status` | Atualiza status | admin + JWT |
| DELETE | `/api/orders/:id` | Remove pedido | admin + JWT |

### Usuários (`/api/users`)
| Verbo | Endpoint | Descrição | Acesso |
|-------|----------|-----------|--------|
| GET | `/api/users` | Lista usuários | admin + JWT |
| GET | `/api/users/:id` | Usuário por ID | admin + JWT |
| DELETE | `/api/users/:id` | Remove usuário | admin + JWT |

### Outros
| Verbo | Endpoint | Descrição |
|-------|----------|-----------|
| GET | `/` | Mensagem de boas-vindas |
| GET | `/health` | Status da API e tipo de armazenamento |

## Coleção Postman
O arquivo `Norte-Market.postman_collection.json` contém todos os endpoints. Importe no Postman:
1. Defina a variável `baseUrl` (ex.: `http://localhost:3000` ou a URL do Render).
2. Faça `POST /api/auth/login` e salve o token na variável `token`.
3. Use `Bearer {{token}}` no header `Authorization` das rotas protegidas.

## Deploy no Render
1. Crie um **Web Service** no Render conectando este repositório GitHub.
2. Build command: `npm install`
3. Start command: `npm start`
4. Adicione a variável de ambiente `DATABASE_URL` (PostgreSQL do Render) e `JWT_SECRET`.
5. Após o deploy, rode o seed para popular o banco (ou inclua no build).

O serviço de banco recomendado no Render é o **PostgreSQL**. Caso não configure `DATABASE_URL`, a API usa armazenamento local em arquivo (funciona para demonstração, mas não persiste entre reinícios no Render).

## Scripts
- `npm start` — inicia o servidor
- `npm run seed` — popula o banco com dados reais (usuários + produtos)
