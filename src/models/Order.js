const { query } = require('../config/db');

async function createOrder({ user_id, total, status = 'pendente' }) {
  const res = await query(
    'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING id, user_id, total, status, created_at',
    [user_id, total, status]
  );
  return res.rows[0];
}

async function listOrders() {
  const res = await query('SELECT id, user_id, total, status, created_at FROM orders ORDER BY created_at DESC');
  return res.rows;
}

async function findOrderById(id) {
  const res = await query('SELECT id, user_id, total, status, created_at FROM orders WHERE id = $1', [id]);
  return res.rows[0];
}

async function listOrdersByUser(userId) {
  const res = await query('SELECT id, user_id, total, status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return res.rows;
}

async function updateOrderStatus(id, status) {
  const res = await query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, user_id, total, status, created_at',
    [status, id]
  );
  return res.rows[0];
}

async function deleteOrder(id) {
  const res = await query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
  return res.rows[0];
}

module.exports = {
  createOrder,
  listOrders,
  findOrderById,
  listOrdersByUser,
  updateOrderStatus,
  deleteOrder
};
