const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  restaurantName: {
    type: String,
    required: [true, 'Restaurant name is required']
  },
  description: {
    type: String
  },
  logoUrl: {
    type: String
  },
  bannerImageUrl: {
    type: String
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  ratingAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  openingTime: {
    type: String,
    default: '10:00'
  },
  closingTime: {
    type: String,
    default: '23:00'
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
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

restaurantSchema.index({ userId: 1 });
restaurantSchema.index({ restaurantName: 'text', description: 'text' });
restaurantSchema.index({ ratingAverage: -1 });
restaurantSchema.index({ isActive: 1, isVerified: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
