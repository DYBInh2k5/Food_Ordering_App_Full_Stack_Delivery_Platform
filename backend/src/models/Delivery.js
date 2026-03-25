const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  pickupTime: {
    type: Date
  },
  deliveryTime: {
    type: Date
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  status: {
    type: String,
    enum: ['accepted', 'picked_up', 'on_the_way', 'delivered', 'failed'],
    default: 'accepted'
  },
  deliveryProofPhoto: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

deliverySchema.index({ orderId: 1 });
deliverySchema.index({ driverId: 1 });
deliverySchema.index({ status: 1 });
deliverySchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Delivery', deliverySchema);
