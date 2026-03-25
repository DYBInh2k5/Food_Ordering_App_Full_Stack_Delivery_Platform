const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const Driver = require('../models/Driver');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Create Restaurant Review
exports.createRestaurantReview = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;
  const { rating, title, comment } = req.body;
  const customerId = req.user._id;

  // Validate input
  if (!rating || !title || !comment) {
    return next(new AppError('Rating, title, and comment are required', 400));
  }

  if (rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  // Check if restaurant exists
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError('Restaurant not found', 404));
  }

  // Check if user already reviewed this restaurant
  const existingReview = await Review.findOne({
    customerId,
    restaurantId,
    type: 'restaurant'
  });

  if (existingReview) {
    return next(new AppError('You have already reviewed this restaurant', 400));
  }

  // Create review
  const review = await Review.create({
    customerId,
    restaurantId,
    type: 'restaurant',
    rating,
    title,
    comment
  });

  // Update restaurant rating
  const reviews = await Review.find({ restaurantId, type: 'restaurant' });
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2);
  
  await Restaurant.findByIdAndUpdate(restaurantId, {
    rating: avgRating,
    totalReviews: reviews.length
  });

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    review
  });
});

// Get Restaurant Reviews
exports.getRestaurantReviews = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;
  const { page = 1, limit = 10, sortBy = 'recent' } = req.query;

  const skip = (page - 1) * limit;
  const sortOptions = {
    recent: { createdAt: -1 },
    highest: { rating: -1 },
    lowest: { rating: 1 }
  };

  const reviews = await Review.find({
    restaurantId,
    type: 'restaurant'
  })
    .populate('customerId', 'name')
    .sort(sortOptions[sortBy] || sortOptions.recent)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Review.countDocuments({
    restaurantId,
    type: 'restaurant'
  });

  res.status(200).json({
    success: true,
    reviews,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  });
});

// Update Restaurant Review
exports.updateRestaurantReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const customerId = req.user._id;

  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check ownership
  if (review.customerId.toString() !== customerId.toString()) {
    return next(new AppError('Not authorized to update this review', 403));
  }

  // Update review
  review.rating = rating || review.rating;
  review.title = title || review.title;
  review.comment = comment || review.comment;
  await review.save();

  // Recalculate restaurant rating
  if (review.type === 'restaurant') {
    const reviews = await Review.find({
      restaurantId: review.restaurantId,
      type: 'restaurant'
    });
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2);
    
    await Restaurant.findByIdAndUpdate(review.restaurantId, {
      rating: avgRating
    });
  }

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    review
  });
});

// Delete Restaurant Review
exports.deleteRestaurantReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const customerId = req.user._id;

  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check ownership
  if (review.customerId.toString() !== customerId.toString()) {
    return next(new AppError('Not authorized to delete this review', 403));
  }

  const restaurantId = review.restaurantId;
  await Review.findByIdAndDelete(reviewId);

  // Recalculate restaurant rating
  const reviews = await Review.find({
    restaurantId,
    type: 'restaurant'
  });

  if (reviews.length > 0) {
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2);
    
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: avgRating,
      totalReviews: reviews.length
    });
  } else {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: 5,
      totalReviews: 0
    });
  }

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});

// Create Driver Review
exports.createDriverReview = asyncHandler(async (req, res, next) => {
  const { driverId } = req.params;
  const { rating, title, comment } = req.body;
  const customerId = req.user._id;

  // Validate input
  if (!rating || !title || !comment) {
    return next(new AppError('Rating, title, and comment are required', 400));
  }

  if (rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  // Check if driver exists
  const driver = await Driver.findById(driverId);
  if (!driver) {
    return next(new AppError('Driver not found', 404));
  }

  // Check if user already reviewed this driver
  const existingReview = await Review.findOne({
    customerId,
    driverId,
    type: 'driver'
  });

  if (existingReview) {
    return next(new AppError('You have already reviewed this driver', 400));
  }

  // Create review
  const review = await Review.create({
    customerId,
    driverId,
    type: 'driver',
    rating,
    title,
    comment
  });

  // Update driver rating
  const reviews = await Review.find({ driverId, type: 'driver' });
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2);
  
  await Driver.findByIdAndUpdate(driverId, {
    rating: avgRating,
    totalReviews: reviews.length
  });

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    review
  });
});

// Get Driver Reviews
exports.getDriverReviews = asyncHandler(async (req, res, next) => {
  const { driverId } = req.params;
  const { page = 1, limit = 10, sortBy = 'recent' } = req.query;

  const skip = (page - 1) * limit;
  const sortOptions = {
    recent: { createdAt: -1 },
    highest: { rating: -1 },
    lowest: { rating: 1 }
  };

  const reviews = await Review.find({
    driverId,
    type: 'driver'
  })
    .populate('customerId', 'name')
    .sort(sortOptions[sortBy] || sortOptions.recent)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Review.countDocuments({
    driverId,
    type: 'driver'
  });

  res.status(200).json({
    success: true,
    reviews,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  });
});

// Update Driver Review
exports.updateDriverReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const customerId = req.user._id;

  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check ownership
  if (review.customerId.toString() !== customerId.toString()) {
    return next(new AppError('Not authorized to update this review', 403));
  }

  // Update review
  review.rating = rating || review.rating;
  review.title = title || review.title;
  review.comment = comment || review.comment;
  await review.save();

  // Recalculate driver rating
  if (review.type === 'driver') {
    const reviews = await Review.find({
      driverId: review.driverId,
      type: 'driver'
    });
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2);
    
    await Driver.findByIdAndUpdate(review.driverId, {
      rating: avgRating
    });
  }

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    review
  });
});

// Delete Driver Review
exports.deleteDriverReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const customerId = req.user._id;

  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check ownership
  if (review.customerId.toString() !== customerId.toString()) {
    return next(new AppError('Not authorized to delete this review', 403));
  }

  const driverId = review.driverId;
  await Review.findByIdAndDelete(reviewId);

  // Recalculate driver rating
  const reviews = await Review.find({
    driverId,
    type: 'driver'
  });

  if (reviews.length > 0) {
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2);
    
    await Driver.findByIdAndUpdate(driverId, {
      rating: avgRating,
      totalReviews: reviews.length
    });
  } else {
    await Driver.findByIdAndUpdate(driverId, {
      rating: 5,
      totalReviews: 0
    });
  }

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});

// Get User's Reviews
exports.getUserReviews = asyncHandler(async (req, res, next) => {
  const customerId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const reviews = await Review.find({ customerId })
    .populate('restaurantId', 'restaurantName image')
    .populate('driverId', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Review.countDocuments({ customerId });

  res.status(200).json({
    success: true,
    reviews,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  });
});
