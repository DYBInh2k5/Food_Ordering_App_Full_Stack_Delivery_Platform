const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createDriver,
  getAvailableOrders,
  acceptOrder,
  rejectOrder,
  updateLocation,
  completeDelivery,
  getDriverProfile,
  getActiveDelivery,
  getDeliveryHistory,
  getNearblyDrivers,
  rateDriver
} = require('../controllers/driver.controller');

const router = express.Router();

// Protected routes - Driver only
router.use(protect);

// Driver registration
router.post('/', authorize('driver'), createDriver);

// Get driver profile
router.get('/profile', authorize('driver'), getDriverProfile);

// Get available orders
router.get('/available-orders', authorize('driver'), getAvailableOrders);

// Accept delivery order
router.post('/:orderId/accept', authorize('driver'), acceptOrder);

// Reject delivery order
router.post('/:orderId/reject', authorize('driver'), rejectOrder);

// Update location (GPS)
router.put('/location', authorize('driver'), updateLocation);

// Complete delivery
router.post('/:orderId/complete', authorize('driver'), completeDelivery);

// Get active delivery
router.get('/active-delivery', authorize('driver'), getActiveDelivery);

// Get delivery history
router.get('/history', authorize('driver'), getDeliveryHistory);

// Public route - Get nearby drivers
router.get('/nearby', getNearblyDrivers);

// Rate driver (customer can rate after delivery)
router.put('/:driverId/rating', protect, rateDriver);

module.exports = router;
