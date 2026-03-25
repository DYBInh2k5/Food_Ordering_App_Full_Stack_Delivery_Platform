const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected for authenticated users
router.use(protect);

router.post('/', authorize('customer'), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('restaurant'), updateOrderStatus);
router.post('/:id/cancel', cancelOrder);

module.exports = router;
