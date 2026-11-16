const { query } = require('../config/db');
const { BCRYPT_SALT_ROUNDS } = require('../config/auth');
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

async function createUser({ name, email, password, role = 'customer' }) {
  const passwordHash = await hashPassword(password);
  const res = await query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
    [name, email, passwordHash, role]
  );
  return res.rows[0];
}

async function findUserByEmail(email) {
  const res = await query('SELECT id, name, email, password, role, created_at FROM users WHERE email = $1', [email]);
  return res.rows[0];
}

async function findUserById(id) {
  const res = await query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);
  return res.rows[0];
}

async function listUsers() {
  const res = await query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
  return res.rows;
}

async function updateUser(id, fields) {
  const allowed = ['name', 'email', 'role', 'password'];
  const updates = {};
  for (const key of Object.keys(fields)) {
    if (allowed.includes(key)) updates[key] = fields[key];
  }
  const keys = Object.keys(updates);
  if (keys.length === 0) return null;
  const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const values = [...Object.values(updates), id];
  const res = await query(
    `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING id, name, email, role, created_at`,
    values
  );
  return res.rows[0];
}

async function deleteUser(id) {
  const res = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  return res.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  listUsers,
  updateUser,
  deleteUser,
  comparePassword,
  hashPassword
};
