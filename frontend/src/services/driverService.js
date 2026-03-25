import api from './api';

const driverService = {
  // Create driver profile
  createDriver: (licenseNumber, vehicleType, phoneNumber) =>
    api.post('/drivers', { licenseNumber, vehicleType, phoneNumber }),

  // Get driver profile
  getDriverProfile: () =>
    api.get('/drivers/profile'),

  // Get available orders
  getAvailableOrders: () =>
    api.get('/drivers/available-orders'),

  // Accept order
  acceptOrder: (orderId) =>
    api.post(`/drivers/${orderId}/accept`),

  // Reject order
  rejectOrder: (orderId, reason = '') =>
    api.post(`/drivers/${orderId}/reject`, { reason }),

  // Update location
  updateLocation: (latitude, longitude) =>
    api.put('/drivers/location', { latitude, longitude }),

  // Complete delivery
  completeDelivery: (orderId) =>
    api.post(`/drivers/${orderId}/complete`),

  // Get active delivery
  getActiveDelivery: () =>
    api.get('/drivers/active-delivery'),

  // Get delivery history
  getDeliveryHistory: (page = 1, limit = 10) =>
    api.get('/drivers/history', { params: { page, limit } }),

  // Get nearby drivers
  getNearblyDrivers: (latitude, longitude, maxDistance = 5000) =>
    api.get('/drivers/nearby', { params: { latitude, longitude, maxDistance } }),

  // Rate driver
  rateDriver: (driverId, rating, comment = '') =>
    api.put(`/drivers/${driverId}/rating`, { rating, comment })
};

export default driverService;
