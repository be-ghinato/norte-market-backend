require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

let pool;
let useFileStore = false;

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'db.json');

function ensureFileStore() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [], products: [], orders: [] }, null, 2));
  }
}

function readFileStore() {
  ensureFileStore();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeFileStore(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  pool.on('error', (err) => {
    console.error('Erro inesperado no cliente do banco', err);
  });
} else {
  useFileStore = true;
  ensureFileStore();
  console.log('[DB] Usando armazenamento em arquivo (data/db.json). Defina DATABASE_URL para usar PostgreSQL.');
}

async function query(text, params = []) {
  if (pool) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount });
    return res;
  }

  const data = readFileStore();
  const lower = text.toLowerCase().trim();

  if (lower.startsWith('select')) {
    let collection = 'products';
    if (lower.includes('from users')) collection = 'users';
    else if (lower.includes('from orders')) collection = 'orders';

    let rows = data[collection];

    const idMatch = text.match(/where\s+(\w+)\s*=\s*\$1/i);
    if (idMatch && params[0] !== undefined) {
      const col = idMatch[1];
      rows = rows.filter(r => r[col] != null && String(r[col]) === String(params[0]));
    }

    const emailMatch = text.match(/where\s+email\s*=\s*\$1/i);
    if (emailMatch && params[0] !== undefined) {
      rows = rows.filter(r => r.email === params[0]);
    }

    if (lower.includes('order by created_at desc')) {
      rows = [...rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const limitMatch = text.match(/limit\s*\$(\d+)/i);
    if (limitMatch) {
      const n = parseInt(params[parseInt(limitMatch[1]) - 1], 10);
      rows = rows.slice(0, n);
    }

    return { rows };
  }

  if (lower.startsWith('insert')) {
    let collection = 'products';
    if (lower.includes('into users')) collection = 'users';
    else if (lower.includes('into orders')) collection = 'orders';

    // aceita tanto params[0] como objeto quanto parâmetros positionais ($1, $2, ...)
    let paramsObj = params[0];
    const colsMatch = text.match(/\(([^)]*)\)\s*VALUES/i);
    if (colsMatch && Array.isArray(params) && params.length > 0 && typeof params[0] !== 'object') {
      const cols = colsMatch[1].split(',').map((c) => c.trim());
      paramsObj = {};
      cols.forEach((c, i) => {
        paramsObj[c] = params[i];
      });
    }
    if (!paramsObj || typeof paramsObj !== 'object') paramsObj = {};

    const now = new Date().toISOString();
    const row = { ...paramsObj, created_at: now, id: Date.now() };
    data[collection].push(row);
    writeFileStore(data);
    return { rows: [row], rowCount: 1 };
  }

  if (lower.startsWith('update')) {
    let collection = 'products';
    if (lower.includes('users')) collection = 'users';
    else if (lower.includes('orders')) collection = 'orders';

    const setMatches = [...text.matchAll(/(\w+)\s*=\s*\$(\d+)/g)];
    const whereMatch = text.match(/where\s+id\s*=\s*\$(\d+)/i);
    const idParam = whereMatch ? params[parseInt(whereMatch[1]) - 1] : null;

    const updates = {};
    for (const [, col, idx] of setMatches) {
      updates[col] = params[parseInt(idx) - 1];
    }

    let rowCount = 0;
    data[collection] = data[collection].map(r => {
      if (r.id == idParam) {
        rowCount++;
        return { ...r, ...updates };
      }
      return r;
    });
    writeFileStore(data);
    return { rows: data[collection].filter(r => r.id == idParam), rowCount };
  }

  if (lower.startsWith('delete')) {
    let collection = 'products';
    if (lower.includes('from users')) collection = 'users';
    else if (lower.includes('from orders')) collection = 'orders';

    const whereMatch = text.match(/where\s+id\s*=\s*\$(\d+)/i);
    const idParam = whereMatch ? params[parseInt(whereMatch[1]) - 1] : null;

    const before = data[collection].length;
    data[collection] = data[collection].filter(r => r.id != idParam);
    writeFileStore(data);
    return { rowCount: before - data[collection].length };
  }

  return { rows: [], rowCount: 0 };
}

async function initSchema() {
  if (pool) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pendente',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('[DB] Esquema PostgreSQL verificado/criado.');
  } else {
    ensureFileStore();
    console.log('[DB] Armazenamento em arquivo pronto.');
  }
}

module.exports = { query, initSchema, pool, useFileStore };
