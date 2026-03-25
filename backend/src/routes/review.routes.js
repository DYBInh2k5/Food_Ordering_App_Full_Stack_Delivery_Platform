const express = require('express');
const {
  createRestaurantReview,
  getRestaurantReviews,
  updateRestaurantReview,
  deleteRestaurantReview,
  createDriverReview,
  getDriverReviews,
  updateDriverReview,
  deleteDriverReview,
  getUserReviews
} = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Restaurant Reviews
router.post('/restaurant/:restaurantId', protect, createRestaurantReview);
router.get('/restaurant/:restaurantId', getRestaurantReviews);
router.put('/restaurant/:reviewId', protect, updateRestaurantReview);
router.delete('/restaurant/:reviewId', protect, deleteRestaurantReview);

// Driver Reviews
router.post('/driver/:driverId', protect, createDriverReview);
router.get('/driver/:driverId', getDriverReviews);
router.put('/driver/:reviewId', protect, updateDriverReview);
router.delete('/driver/:reviewId', protect, deleteDriverReview);

// User's Reviews
router.get('/my-reviews', protect, getUserReviews);

module.exports = router;
