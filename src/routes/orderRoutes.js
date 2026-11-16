const express = require('express');
const router = express.Router();
const {
  list,
  getById,
  create,
  listByUser,
  updateStatus,
  remove
} = require('../controllers/orderController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { validateOrder } = require('../middleware/validateMiddleware');

router.get('/', authenticateToken, isAdmin, list);
router.get('/me', authenticateToken, listByUser);
router.get('/:id', authenticateToken, getById);
router.post('/', authenticateToken, validateOrder, create);
router.put('/:id/status', authenticateToken, isAdmin, updateStatus);
router.delete('/:id', authenticateToken, isAdmin, remove);

module.exports = router;
