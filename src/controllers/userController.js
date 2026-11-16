const User = require('../models/User');

async function list(req, res) {
  try {
    const users = await User.listUsers();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao listar usuários.' });
  }
}

async function getById(req, res) {
  try {
    const user = await User.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
}

async function remove(req, res) {
  try {
    const deleted = await User.deleteUser(req.params.id);
    if (!deleted || deleted.rowCount === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    return res.json({ message: 'Usuário removido com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao remover usuário.' });
  }
}

module.exports = { list, getById, remove };
