const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  streetAddress: {
    type: String,
    required: [true, 'Street address is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  district: {
    type: String,
    required: [true, 'District is required']
  },
  ward: {
    type: String
  },
  postalCode: {
    type: String
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  addressType: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

addressSchema.index({ userId: 1 });
addressSchema.index({ userId: 1, isDefault: 1 });

module.exports = mongoose.model('Address', addressSchema);
