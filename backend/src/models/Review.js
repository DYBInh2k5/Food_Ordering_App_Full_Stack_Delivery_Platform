const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  type: {
    type: String,
    enum: ['restaurant', 'driver'],
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    maxlength: 200
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: 500
  },
  photos: [String],
  helpful: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

reviewSchema.index({ restaurantId: 1 });
reviewSchema.index({ driverId: 1 });
reviewSchema.index({ customerId: 1 });
reviewSchema.index({ createdAt: -1 });

// Compound indexes for unique reviews
reviewSchema.index({ customerId: 1, restaurantId: 1, type: 1 });
reviewSchema.index({ customerId: 1, driverId: 1, type: 1 });

module.exports = mongoose.model('Review', reviewSchema);
