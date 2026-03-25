const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createPaymentIntent,
  confirmPayment,
  getPayment,
  refundPayment,
  getPayments
} = require('../controllers/payment.controller');

const router = express.Router();

// Protected routes - all require authentication
router.use(protect);

// Create payment intent
router.post('/intent', createPaymentIntent);

// Confirm payment
router.post('/confirm', confirmPayment);

// Get payment details
router.get('/:id', getPayment);

// Refund payment
router.post('/:id/refund', refundPayment);

// Get payment history
router.get('/', getPayments);

module.exports = router;
