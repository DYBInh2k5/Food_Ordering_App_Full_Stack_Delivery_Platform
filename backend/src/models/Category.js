const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  categoryName: {
    type: String,
    required: [true, 'Category name is required']
  },
  description: {
    type: String
  },
  imageUrl: {
    type: String
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

categorySchema.index({ restaurantId: 1 });
categorySchema.index({ restaurantId: 1, isActive: 1 });

module.exports = mongoose.model('Category', categorySchema);
