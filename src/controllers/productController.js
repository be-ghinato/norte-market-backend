const Product = require('../models/Product');

async function list(req, res) {
  try {
    const products = await Product.listProducts();
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao listar produtos.' });
  }
}

async function getById(req, res) {
  try {
    const product = await Product.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar produto.' });
  }
}

async function create(req, res) {
  try {
    const product = await Product.createProduct(req.body);
    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar produto.' });
  }
}

async function update(req, res) {
  try {
    const product = await Product.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado ou nada a atualizar.' });
    }
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar produto.' });
  }
}

async function remove(req, res) {
  try {
    console.log('DELETE product id:', req.params.id);
    const deleted = await Product.deleteProduct(req.params.id);
    console.log('Deleted result:', deleted);
    if (!deleted) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    return res.json({ message: 'Produto removido com sucesso.' });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ message: 'Erro ao remover produto.' });
  }
}

module.exports = { list, getById, create, update, remove };
