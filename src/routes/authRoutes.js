const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateLogin, validateRegister } = require('../middleware/validateMiddleware');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticateToken, me);

module.exports = router;
