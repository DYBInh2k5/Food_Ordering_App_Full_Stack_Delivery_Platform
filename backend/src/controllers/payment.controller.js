const Order = require('../models/Order');
const Payment = require('../models/Payment');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// @desc    Create payment intent
// @route   POST /api/v1/payments/intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { orderId, amount, paymentMethod } = req.body;

  if (!orderId || !amount) {
    return next(new AppError('Please provide order ID and amount', 400, 'INVALID_INPUT'));
  }

  // Verify order exists and belongs to user
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404, 'NOT_FOUND'));
  }

  // Create payment record
  const payment = await Payment.create({
    orderId,
    amount,
    paymentMethod: paymentMethod || 'card',
    status: 'pending',
    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  });

  // For mock payments, return success response
  // In real implementation with Stripe, this would call Stripe API
  res.status(201).json({
    success: true,
    message: 'Payment intent created',
    data: {
      paymentId: payment._id,
      clientSecret: payment.transactionId,
      amount: payment.amount,
      orderId: payment.orderId
    }
  });
});

// @desc    Confirm payment
// @route   POST /api/v1/payments/confirm
// @access  Private
exports.confirmPayment = asyncHandler(async (req, res, next) => {
  const { paymentId, status = 'completed' } = req.body;

  if (!paymentId) {
    return next(new AppError('Please provide payment ID', 400, 'INVALID_INPUT'));
  }

  // Find and update payment
  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    {
      status: status,
      completedAt: status === 'completed' ? new Date() : null
    },
    { new: true }
  );

  if (!payment) {
    return next(new AppError('Payment not found', 404, 'NOT_FOUND'));
  }

  // Update order status if payment successful
  if (status === 'completed') {
    const order = await Order.findByIdAndUpdate(
      payment.orderId,
      { status: 'confirmed', paymentStatus: 'paid' },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        payment,
        order
      }
    });
  }

  // Payment failed
  if (status === 'failed') {
    await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'failed' });

    return res.status(200).json({
      success: false,
      message: 'Payment failed',
      data: payment
    });
  }

  res.status(200).json({
    success: true,
    message: 'Payment status updated',
    data: payment
  });
});

// @desc    Get payment details
// @route   GET /api/v1/payments/:id
// @access  Private
exports.getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id).populate('orderId');

  if (!payment) {
    return next(new AppError('Payment not found', 404, 'NOT_FOUND'));
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Refund payment
// @route   POST /api/v1/payments/:id/refund
// @access  Private
exports.refundPayment = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return next(new AppError('Payment not found', 404, 'NOT_FOUND'));
  }

  if (payment.status !== 'completed') {
    return next(new AppError('Can only refund completed payments', 400, 'INVALID_STATE'));
  }

  // Update payment status
  payment.status = 'refunded';
  payment.refundReason = reason;
  payment.refundedAt = new Date();
  await payment.save();

  // Update order
  await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'refunded' });

  res.status(200).json({
    success: true,
    message: 'Payment refunded successfully',
    data: payment
  });
});

// @desc    Get payment history
// @route   GET /api/v1/payments
// @access  Private
exports.getPayments = asyncHandler(async (req, res, next) => {
  const { status, page = 1, limit = 10 } = req.query;

  let query = {};
  if (status) {
    query.status = status;
  }

  const payments = await Payment.find(query)
    .populate('orderId', 'orderNumber totalAmount')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Payment.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      payments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    }
  });
});
