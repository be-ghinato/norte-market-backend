const express = require('express');
const router = express.Router();
const { list, getById, remove } = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, isAdmin, list);
router.get('/:id', authenticateToken, isAdmin, getById);
router.delete('/:id', authenticateToken, isAdmin, remove);

module.exports = router;
