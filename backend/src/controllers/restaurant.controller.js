const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Address = require('../models/Address');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// @desc    Get all restaurants with pagination, search, filter
// @route   GET /api/v1/restaurants
// @access  Public
exports.getAllRestaurants = asyncHandler(async (req, res, next) => {
  const { search, page = 1, limit = 10, sort = '-ratingAverage' } = req.query;

  let query = { isActive: true, isVerified: true };

  if (search) {
    query.$or = [
      { restaurantName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const restaurants = await Restaurant.find(query)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-updatedAt');

  const total = await Restaurant.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      restaurants,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    }
  });
});

// @desc    Get restaurant details by ID
// @route   GET /api/v1/restaurants/:id
// @access  Public
exports.getRestaurantById = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id)
    .populate('addressId', 'streetAddress city district ward latitude longitude');

  if (!restaurant) {
    return next(new AppError('Restaurant not found', 404, 'NOT_FOUND'));
  }

  res.status(200).json({
    success: true,
    data: restaurant
  });
});

// @desc    Get restaurant menu with categories
// @route   GET /api/v1/restaurants/:id/menu
// @access  Public
exports.getRestaurantMenu = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    return next(new AppError('Restaurant not found', 404, 'NOT_FOUND'));
  }

  const categories = await Category.find({ restaurantId: id, isActive: true })
    .select('-restaurantId')
    .sort('displayOrder');

  const menu = await Promise.all(
    categories.map(async (category) => {
      const items = await MenuItem.find({ 
        categoryId: category._id, 
        isAvailable: true 
      }).select('-restaurantId -categoryId');
      
      return {
        ...category.toObject(),
        items
      };
    })
  );

  res.status(200).json({
    success: true,
    data: {
      restaurantId: id,
      restaurantName: restaurant.restaurantName,
      menu
    }
  });
});

// @desc    Create restaurant (Protected)
// @route   POST /api/v1/restaurants
// @access  Private (Restaurant owner)
exports.createRestaurant = asyncHandler(async (req, res, next) => {
  const { restaurantName, description, phoneNumber, addressId, openingTime, closingTime, deliveryFee, minOrderValue } = req.body;

  // Check if address exists
  const address = await Address.findById(addressId);
  if (!address) {
    return next(new AppError('Address not found', 404, 'NOT_FOUND'));
  }

  const restaurant = await Restaurant.create({
    userId: req.userId,
    restaurantName,
    description,
    phoneNumber,
    addressId,
    openingTime,
    closingTime,
    deliveryFee,
    minOrderValue
  });

  res.status(201).json({
    success: true,
    message: 'Restaurant created successfully',
    data: restaurant
  });
});

// @desc    Update restaurant (Protected)
// @route   PUT /api/v1/restaurants/:id
// @access  Private (Restaurant owner)
exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  let restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(new AppError('Restaurant not found', 404, 'NOT_FOUND'));
  }

  // Check ownership
  if (restaurant.userId.toString() !== req.userId) {
    return next(new AppError('Not authorized to update this restaurant', 403, 'FORBIDDEN'));
  }

  restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Restaurant updated successfully',
    data: restaurant
  });
});

// @desc    Get restaurant orders (Protected - Restaurant owner)
// @route   GET /api/v1/restaurants/:id/orders
// @access  Private
exports.getRestaurantOrders = asyncHandler(async (req, res, next) => {
  const Order = require('../models/Order');
  const { status, page = 1, limit = 10 } = req.query;

  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return next(new AppError('Restaurant not found', 404, 'NOT_FOUND'));
  }

  if (restaurant.userId.toString() !== req.userId) {
    return next(new AppError('Not authorized', 403, 'FORBIDDEN'));
  }

  let query = { restaurantId: req.params.id };
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('customerId', 'userId')
    .populate('deliveryAddressId');

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
