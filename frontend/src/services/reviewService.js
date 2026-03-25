import api from './api';

const reviewService = {
  // Restaurant Reviews
  createRestaurantReview: (restaurantId, reviewData) =>
    api.post(`/reviews/restaurant/${restaurantId}`, reviewData),
  
  getRestaurantReviews: (restaurantId, params = {}) =>
    api.get(`/reviews/restaurant/${restaurantId}`, { params }),
  
  updateRestaurantReview: (reviewId, reviewData) =>
    api.put(`/reviews/restaurant/${reviewId}`, reviewData),
  
  deleteRestaurantReview: (reviewId) =>
    api.delete(`/reviews/restaurant/${reviewId}`),

  // Driver Reviews
  createDriverReview: (driverId, reviewData) =>
    api.post(`/reviews/driver/${driverId}`, reviewData),
  
  getDriverReviews: (driverId, params = {}) =>
    api.get(`/reviews/driver/${driverId}`, { params }),
  
  updateDriverReview: (reviewId, reviewData) =>
    api.put(`/reviews/driver/${reviewId}`, reviewData),
  
  deleteDriverReview: (reviewId) =>
    api.delete(`/reviews/driver/${reviewId}`),

  // User's reviews
  getUserReviews: (params = {}) =>
    api.get('/reviews/my-reviews', { params }),

  // Get review statistics
  getRestaurantStats: (restaurantId) =>
    api.get(`/reviews/restaurant/${restaurantId}/stats`),

  getDriverStats: (driverId) =>
    api.get(`/reviews/driver/${driverId}/stats`)
};

export default reviewService;
