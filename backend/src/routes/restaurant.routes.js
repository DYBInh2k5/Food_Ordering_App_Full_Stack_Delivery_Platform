const express = require('express');
const {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  createRestaurant,
  updateRestaurant,
  getRestaurantOrders
} = require('../controllers/restaurant.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);

// Protected routes
router.post('/', protect, authorize('restaurant'), createRestaurant);
router.put('/:id', protect, authorize('restaurant'), updateRestaurant);
router.get('/:id/orders', protect, authorize('restaurant'), getRestaurantOrders);

module.exports = router;
