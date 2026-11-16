const User = require('../models/User');
const Product = require('../models/Product');

const ADMIN_EMAIL = 'admin@nortemarket.com';
const ADMIN_PASSWORD = 'admin123';
const CUSTOMER_EMAIL = 'cliente@nortemarket.com';
const CUSTOMER_PASSWORD = 'cliente123';

const PRODUCTS = [
  { name: 'Notebook Gamer', price: 4599.90, category: 'Eletrônicos', stock: 12 },
  { name: 'Mouse Sem Fio', price: 89.90, category: 'Eletrônicos', stock: 50 },
  { name: 'Teclado Mecânico', price: 249.90, category: 'Eletrônicos', stock: 25 },
  { name: 'Monitor 27" 4K', price: 1499.00, category: 'Eletrônicos', stock: 8 },
  { name: 'Cadeira Gamer', price: 899.90, category: 'Móveis', stock: 15 },
  { name: 'Mesa de Escritório', price: 549.00, category: 'Móveis', stock: 10 },
  { name: 'Fone de Ouvido', price: 199.90, category: 'Eletrônicos', stock: 30 },
  { name: 'Webcam Full HD', price: 349.90, category: 'Eletrônicos', stock: 18 }
];

async function seed() {
  let admin = await User.findUserByEmail(ADMIN_EMAIL);
  if (!admin) {
    admin = await User.createUser({ name: 'Administrador', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
    console.log('Admin criado:', admin.email);
  } else {
    console.log('Admin já existe:', admin.email);
  }

  let customer = await User.findUserByEmail(CUSTOMER_EMAIL);
  if (!customer) {
    customer = await User.createUser({ name: 'Cliente Teste', email: CUSTOMER_EMAIL, password: CUSTOMER_PASSWORD, role: 'customer' });
    console.log('Cliente criado:', customer.email);
  } else {
    console.log('Cliente já existe:', customer.email);
  }

  for (const p of PRODUCTS) {
    const existing = await Product.findProductById(p.name); // não usado, apenas insere
    await Product.createProduct(p);
  }
  console.log(`${PRODUCTS.length} produtos inseridos.`);
  console.log('Seed concluído.');
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
