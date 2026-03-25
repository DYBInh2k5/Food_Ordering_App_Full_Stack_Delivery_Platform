const Driver = require('../models/Driver');
const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// @desc    Create/Register driver profile
// @route   POST /api/v1/drivers
// @access  Private (User with driver role)
exports.createDriver = asyncHandler(async (req, res, next) => {
  const { licenseNumber, vehicleType, phoneNumber } = req.body;

  if (!licenseNumber || !vehicleType) {
    return next(new AppError('Please provide license number and vehicle type', 400, 'INVALID_INPUT'));
  }

  const driver = await Driver.create({
    userId: req.userId,
    licenseNumber,
    vehicleType,
    phoneNumber,
    isAvailable: true,
    rating: 5,
    completedDeliveries: 0,
    currentLocation: {
      type: 'Point',
      coordinates: [0, 0] // Default location
    }
  });

  res.status(201).json({
    success: true,
    message: 'Driver profile created',
    data: driver
  });
});

// @desc    Get all available orders for driver
// @route   GET /api/v1/drivers/available-orders
// @access  Private (Driver)
exports.getAvailableOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({
    status: 'ready', // Orders ready for pickup
    driverId: null  // Not yet assigned
  })
    .populate('customerId', 'phoneNumber')
    .populate('restaurantId', 'restaurantName address')
    .populate('deliveryAddress')
    .sort('-createdAt')
    .limit(20);

  res.status(200).json({
    success: true,
    data: orders
  });
});

// @desc    Accept delivery order
// @route   POST /api/v1/drivers/:orderId/accept
// @access  Private (Driver)
exports.acceptOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404, 'NOT_FOUND'));
  }

  if (order.status !== 'ready') {
    return next(new AppError('Order is not ready for delivery', 400, 'INVALID_STATE'));
  }

  // Get driver profile
  const driver = await Driver.findOne({ userId: req.userId });
  if (!driver) {
    return next(new AppError('Driver profile not found', 404, 'NOT_FOUND'));
  }

  // Assign driver to order
  order.driverId = driver._id;
  order.status = 'on_the_way';
  await order.save();

  // Create delivery record
  const delivery = await Delivery.create({
    orderId: order._id,
    driverId: driver._id,
    status: 'accepted',
    pickupLocation: order.restaurantId,
    deliveryLocation: order.deliveryAddress,
    currentLocation: driver.currentLocation
  });

  // Update driver availability
  await Driver.findByIdAndUpdate(driver._id, {
    currentOrder: order._id,
    isAvailable: false
  });

  res.status(200).json({
    success: true,
    message: 'Order accepted',
    data: {
      order,
      delivery
    }
  });
});

// @desc    Reject delivery order
// @route   POST /api/v1/drivers/:orderId/reject
// @access  Private (Driver)
exports.rejectOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404, 'NOT_FOUND'));
  }

  res.status(200).json({
    success: true,
    message: 'Order rejected',
    data: { reason }
  });
});

// @desc    Update delivery location (GPS)
// @route   PUT /api/v1/drivers/location
// @access  Private (Driver)
exports.updateLocation = asyncHandler(async (req, res, next) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return next(new AppError('Please provide latitude and longitude', 400, 'INVALID_INPUT'));
  }

  const driver = await Driver.findOneAndUpdate(
    { userId: req.userId },
    {
      currentLocation: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      lastLocationUpdate: new Date()
    },
    { new: true }
  );

  if (!driver) {
    return next(new AppError('Driver not found', 404, 'NOT_FOUND'));
  }

  // Update related delivery
  if (driver.currentOrder) {
    await Delivery.findOneAndUpdate(
      { orderId: driver.currentOrder },
      { currentLocation: driver.currentLocation }
    );
  }

  res.status(200).json({
    success: true,
    message: 'Location updated',
    data: driver
  });
});

// @desc    Complete delivery
// @route   POST /api/v1/drivers/:orderId/complete
// @access  Private (Driver)
exports.completeDelivery = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status: 'delivered', deliveredAt: new Date() },
    { new: true }
  );

  if (!order) {
    return next(new AppError('Order not found', 404, 'NOT_FOUND'));
  }

  // Update delivery
  const delivery = await Delivery.findOneAndUpdate(
    { orderId },
    { status: 'delivered', deliveredAt: new Date() },
    { new: true }
  );

  // Update driver
  const driver = await Driver.findOne({ userId: req.userId });
  await Driver.findByIdAndUpdate(driver._id, {
    currentOrder: null,
    isAvailable: true,
    $inc: { completedDeliveries: 1 }
  });

  res.status(200).json({
    success: true,
    message: 'Delivery completed',
    data: {
      order,
      delivery
    }
  });
});

// @desc    Get driver profile
// @route   GET /api/v1/drivers/profile
// @access  Private (Driver)
exports.getDriverProfile = asyncHandler(async (req, res, next) => {
  const driver = await Driver.findOne({ userId: req.userId });

  if (!driver) {
    return next(new AppError('Driver profile not found', 404, 'NOT_FOUND'));
  }

  res.status(200).json({
    success: true,
    data: driver
  });
});

// @desc    Get active delivery for driver
// @route   GET /api/v1/drivers/active-delivery
// @access  Private (Driver)
exports.getActiveDelivery = asyncHandler(async (req, res, next) => {
  const driver = await Driver.findOne({ userId: req.userId });

  if (!driver) {
    return next(new AppError('Driver profile not found', 404, 'NOT_FOUND'));
  }

  const delivery = await Delivery.findOne({
    driverId: driver._id,
    status: { $in: ['accepted', 'picked_up', 'in_transit'] }
  })
    .populate('orderId')
    .populate('customerId');

  res.status(200).json({
    success: true,
    data: delivery
  });
});

// @desc    Get driver delivery history
// @route   GET /api/v1/drivers/history
// @access  Private (Driver)
exports.getDeliveryHistory = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const driver = await Driver.findOne({ userId: req.userId });

  if (!driver) {
    return next(new AppError('Driver profile not found', 404, 'NOT_FOUND'));
  }

  const deliveries = await Delivery.find({ driverId: driver._id })
    .populate('orderId', 'orderNumber totalAmount')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Delivery.countDocuments({ driverId: driver._id });

  res.status(200).json({
    success: true,
    data: {
      deliveries,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get drivers nearby (for admin/customer)
// @route   GET /api/v1/drivers/nearby
// @access  Public
exports.getNearblyDrivers = asyncHandler(async (req, res, next) => {
  const { latitude, longitude, maxDistance = 5000 } = req.query;

  if (!latitude || !longitude) {
    return next(new AppError('Please provide latitude and longitude', 400, 'INVALID_INPUT'));
  }

  const drivers = await Driver.find({
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: maxDistance
      }
    },
    isAvailable: true
  });

  res.status(200).json({
    success: true,
    data: drivers
  });
});

// @desc    Update driver rating
// @route   PUT /api/v1/drivers/:driverId/rating
// @access  Private (Customer who received delivery)
exports.rateDriver = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return next(new AppError('Please provide a rating between 1 and 5', 400, 'INVALID_INPUT'));
  }

  const driver = await Driver.findById(req.params.driverId);
  if (!driver) {
    return next(new AppError('Driver not found', 404, 'NOT_FOUND'));
  }

  // Update driver rating (simple average)
  const newRating = (driver.rating * driver.completedDeliveries + rating) / (driver.completedDeliveries + 1);
  driver.rating = Math.round(newRating * 10) / 10;
  await driver.save();

  res.status(200).json({
    success: true,
    message: 'Driver rated successfully',
    data: driver
  });
});
