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

initSchema().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch((err) => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});

module.exports = app;