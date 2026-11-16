const Order = require('../models/Order');

async function list(req, res) {
  try {
    const orders = await Order.listOrders();
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao listar pedidos.' });
  }
}

async function getById(req, res) {
  try {
    const order = await Order.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar pedido.' });
  }
}

async function create(req, res) {
  try {
    const order = await Order.createOrder({ ...req.body, user_id: req.body.user_id || req.user.id });
    return res.status(201).json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar pedido.' });
  }
}

async function listByUser(req, res) {
  try {
    const orders = await Order.listOrdersByUser(req.user.id);
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao listar pedidos do usuário.' });
  }
}

async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const order = await Order.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar pedido.' });
  }
}

async function remove(req, res) {
  try {
    const deleted = await Order.deleteOrder(req.params.id);
    if (!deleted || deleted.rowCount === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }
    return res.json({ message: 'Pedido removido com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao remover pedido.' });
  }
}

module.exports = { list, getById, create, listByUser, updateStatus, remove };
