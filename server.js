const express = require('express');
const app = express();
app.use(express.json());

// Dados em memória (serão substituídos pelo banco de dados depois)
const products = [
  { id: 1, name: 'Notebook', price: 3500, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 50, category: 'Electronics' },
  { id: 3, name: 'Teclado', price: 100, category: 'Electronics' }
];

// 1) Rota GET - listar todos os produtos
app.get('/api/products', (req, res) => {
  res.status(200).json(products);
});

// 2) Rota GET - produto por id
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
  res.status(200).json(product);
});

// 3) Rota POST - criar novo produto
app.post('/api/products', (req, res) => {
  const { name, price, category } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'Dados incompletos' });
  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    name,
    price,
    category
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// 4) Rota GET - raiz (opcional, para confirmação)
app.get('/', (req, res) => {
  res.json({ message: 'API do Norte Market está rodando!' });
});

// Porta do servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;