const User = require('../models/User');
const Product = require('../models/Product');

const ADMIN_EMAIL = 'admin@norte-market.com';
const ADMIN_PASSWORD = 'admin123';
const CUSTOMER_EMAIL = 'cliente@nortemarket.com';
const CUSTOMER_PASSWORD = 'cliente123';

// Produtos padrão para garantir que o catálogo nunca fique vazio
const DEFAULT_PRODUCTS = [
  { name: 'Notebook Gamer', price: 3599.9, category: 'eletronics', stock: 10 },
  { name: 'Mouse Gamer', price: 199.9, category: 'eletronics', stock: 25 },
  { name: 'Teclado Mecânico', price: 349.9, category: 'eletronics', stock: 15 },
  { name: 'Monitor 24 polegadas', price: 899.9, category: 'eletronics', stock: 8 },
  { name: 'Cadeira Gamer', price: 799.9, category: 'moveis', stock: 12 }
];

async function seed() {
  // Insert admin user
  let admin = await User.findUserByEmail(ADMIN_EMAIL);
  if (!admin) {
    admin = await User.createUser({ name: 'Administrador', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
    console.log('Admin criado:', admin.email);
  } else {
    console.log('Admin já existe:', admin.email);
  }

  // Insert customer user
  let customer = await User.findUserByEmail(CUSTOMER_EMAIL);
  if (!customer) {
    customer = await User.createUser({ name: 'Cliente Teste', email: CUSTOMER_EMAIL, password: CUSTOMER_PASSWORD, role: 'customer' });
    console.log('Cliente criado:', customer.email);
  } else {
    console.log('Cliente já existe:', customer.email);
  }

  // Insert default products if none exist
  const existingProducts = await Product.listProducts();
  if (existingProducts.length === 0) {
    for (const p of DEFAULT_PRODUCTS) {
      await Product.createProduct(p);
    }
    console.log(`${DEFAULT_PRODUCTS.length} produtos padrão inseridos.`);
  } else {
    console.log(`${existingProducts.length} produtos já existentes no banco.`);
  }

  console.log('Seed concluído.');
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  // Não sair do processo - permitir que o servidor rode mesmo com erro no seed
});