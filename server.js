require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initSchema, useFileStore } = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// CORS configurado para Render + Vercel
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow in development; restrict in production
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check - must be defined BEFORE routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: useFileStore ? 'json-file' : 'postgresql' });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'API do Norte Market está rodando!' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;

initSchema().then(async () => {
  // Seed default products if database is empty
  const Product = require('./src/models/Product');
  const existingProducts = await Product.listProducts();
  if (existingProducts.length === 0) {
    const DEFAULT_PRODUCTS = [
      { name: 'Notebook Gamer', price: 3599.9, category: 'eletronics', stock: 10 },
      { name: 'Mouse Gamer', price: 199.9, category: 'eletronics', stock: 25 },
      { name: 'Teclado Mecânico', price: 349.9, category: 'eletronics', stock: 15 },
      { name: 'Monitor 24 polegadas', price: 899.9, category: 'eletronics', stock: 8 },
      { name: 'Cadeira Gamer', price: 799.9, category: 'moveis', stock: 12 }
    ];
    for (const p of DEFAULT_PRODUCTS) {
      await Product.createProduct(p);
    }
    console.log(`${DEFAULT_PRODUCTS.length} produtos padrão inseridos no banco.`);
  } else {
    console.log(`${existingProducts.length} produtos já no banco.`);
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch((err) => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});

module.exports = app;