const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  licensePlate: {
    type: String,
    required: [true, 'License plate is required']
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'car', 'truck'],
    required: true
  },
  licenseImageUrl: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline'
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
  ratingAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  bankName: String,
  bankAccountNumber: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create geospatial index for location-based queries
driverSchema.index({ currentLocation: '2dsphere' });
driverSchema.index({ userId: 1 });
driverSchema.index({ status: 1 });
driverSchema.index({ ratingAverage: -1 });

module.exports = mongoose.model('Driver', driverSchema);
