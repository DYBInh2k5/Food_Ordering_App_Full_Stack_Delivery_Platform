const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const MenuItem = require('../models/MenuItem');
const Customer = require('../models/Customer');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// Generate unique order number
const generateOrderNumber = () => {
  const prefix = 'ORD';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
};

// @desc    Create order
// @route   POST /api/v1/orders
// @access  Private (Customer)
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { restaurantId, deliveryAddressId, items, notes } = req.body;

  if (!restaurantId || !deliveryAddressId || !items || items.length === 0) {
    return next(new AppError('Please provide all required fields', 400, 'INVALID_INPUT'));
  }

  // Calculate total amount
  let totalAmount = 0;
  const orderItems = [];

  for (let item of items) {
    const menuItem = await MenuItem.findById(item.menuItemId);
    if (!menuItem) {
      return next(new AppError(`Menu item ${item.menuItemId} not found`, 404, 'NOT_FOUND'));
    }

    const itemTotal = menuItem.price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      unitPrice: menuItem.price,
      totalPrice: itemTotal,
      specialInstructions: item.specialInstructions
    });
  }

  // Get customer ID
  const customer = await Customer.findOne({ userId: req.userId });
  if (!customer) {
    return next(new AppError('Customer profile not found', 404, 'NOT_FOUND'));
  }

  // Create order
  const orderNumber = generateOrderNumber();
  const order = await Order.create({
    customerId: customer._id,
    restaurantId,
    deliveryAddressId,
    orderNumber,
    totalAmount,
    finalAmount: totalAmount,
    notes
  });

  // Create order items
  const createdItems = await OrderItem.insertMany(
    orderItems.map(item => ({ ...item, orderId: order._id }))
  );

  // Link items to order
  await Order.findByIdAndUpdate(
    order._id,
    { items: createdItems.map(item => item._id) }
  );

  // Update customer total orders
  await Customer.findByIdAndUpdate(
    customer._id,
    { $inc: { totalOrders: 1 } }
  );

  const populatedOrder = await Order.findById(order._id)
    .populate('items')
    .populate('restaurantId', 'restaurantName')
    .populate('deliveryAddressId');

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: populatedOrder
  });
});

// @desc    Get customer orders
// @route   GET /api/v1/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res, next) => {
  const { status, page = 1, limit = 10 } = req.query;

  const customer = await Customer.findOne({ userId: req.userId });
  if (!customer) {
    return next(new AppError('Customer not found', 404, 'NOT_FOUND'));
  }

  let query = { customerId: customer._id };
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('restaurantId', 'restaurantName logoUrl')
    .populate('deliveryAddressId')
    .populate('items');

  const total = await Order.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get order details
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurantId')
    .populate('deliveryAddressId')
    .populate('customerId', 'userId')
    .populate('driverId')
    .populate({
      path: 'items',
      populate: {
        path: 'menuItemId'
      }
    });

  if (!order) {
    return next(new AppError('Order not found', 404, 'NOT_FOUND'));
  }

  // Check authorization
  const customer = await Customer.findOne({ userId: req.userId });
  if (order.customerId._id.toString() !== customer._id.toString()) {
    return next(new AppError('Not authorized', 403, 'FORBIDDEN'));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Restaurant owner)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('Order not found', 404, 'NOT_FOUND'));
  }

  // Check if user is restaurant owner
  const restaurant = await require('../models/Restaurant').findById(order.restaurantId);
  if (restaurant.userId.toString() !== req.userId) {
    return next(new AppError('Not authorized', 403, 'FORBIDDEN'));
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order
  });
});

// @desc    Cancel order
// @route   POST /api/v1/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404, 'NOT_FOUND'));
  }

  // Check authorization
  const customer = await Customer.findOne({ userId: req.userId });
  if (order.customerId.toString() !== customer._id.toString()) {
    return next(new AppError('Not authorized', 403, 'FORBIDDEN'));
  }

  // Can only cancel pending or confirmed orders
  if (!['pending', 'confirmed'].includes(order.status)) {
    return next(new AppError('Order cannot be cancelled at this stage', 400, 'INVALID_STATE'));
  }

  order.status = 'cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order
  });
});
