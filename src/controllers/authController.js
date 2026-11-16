const User = require('../models/User');
const { comparePassword } = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    const user = await User.createUser({ name, email, password, role });
    const token = generateToken(user);

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Login realizado com sucesso.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao fazer login.' });
  }
}

async function me(req, res) {
  try {
    const user = await User.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    const { password, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
}

module.exports = { register, login, me };
