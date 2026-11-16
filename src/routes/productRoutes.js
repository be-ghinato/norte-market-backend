const express = require('express');
const router = express.Router();
const { list, getById, create, update, remove } = require('../controllers/productController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { validateProduct } = require('../middleware/validateMiddleware');

router.get('/', list);
router.get('/:id', getById);
router.post('/', authenticateToken, isAdmin, validateProduct, create);
router.put('/:id', authenticateToken, isAdmin, validateProduct, update);
router.delete('/:id', authenticateToken, isAdmin, remove);

module.exports = router;
