module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'norte-market-secret-dev',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
};
