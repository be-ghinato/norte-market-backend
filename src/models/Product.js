const { query } = require('../config/db');

async function createProduct({ name, price, category, stock = 0 }) {
  const res = await query(
    'INSERT INTO products (name, price, category, stock) VALUES ($1, $2, $3, $4) RETURNING id, name, price, category, stock, created_at',
    [name, price, category, stock]
  );
  return res.rows[0];
}

async function listProducts() {
  const res = await query('SELECT id, name, price, category, stock, created_at FROM products ORDER BY created_at DESC');
  return res.rows;
}

async function findProductById(id) {
  const res = await query('SELECT id, name, price, category, stock, created_at FROM products WHERE id = $1', [id]);
  return res.rows[0];
}

async function updateProduct(id, fields) {
  const allowed = ['name', 'price', 'category', 'stock'];
  const updates = {};
  for (const key of Object.keys(fields)) {
    if (allowed.includes(key)) updates[key] = fields[key];
  }
  const keys = Object.keys(updates);
  if (keys.length === 0) return null;
  const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const values = [...Object.values(updates), id];
  const res = await query(
    `UPDATE products SET ${setClause} WHERE id = $${keys.length + 1} RETURNING id, name, price, category, stock, created_at`,
    values
  );
  return res.rows[0];
}

async function deleteProduct(id) {
  const res = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
  return res.rows[0] || null;
}

module.exports = {
  createProduct,
  listProducts,
  findProductById,
  updateProduct,
  deleteProduct
};
