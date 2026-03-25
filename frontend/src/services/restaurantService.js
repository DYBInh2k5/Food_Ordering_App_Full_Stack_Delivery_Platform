import api from './api';

// For public restaurant browsing
export const restaurantService = {
  getAllRestaurants: async (params = {}) => {
    return api.get('/restaurants', { params });
  },

  getRestaurantById: async (id) => {
    return api.get(`/restaurants/${id}`);
  },

  getRestaurantMenu: async (id) => {
    return api.get(`/restaurants/${id}/menu`);
  },

  createRestaurant: async (data) => {
    return api.post('/restaurants', data);
  },

  updateRestaurant: async (id, data) => {
    return api.put(`/restaurants/${id}`, data);
  },

  getRestaurantOrders: async (id, params = {}) => {
    return api.get(`/restaurants/${id}/orders`, { params });
  }
};

// For restaurant owner dashboard (authenticated)
const restaurantDashboardService = {
  // Orders Management
  getRestaurantOrders: () =>
    api.get('/restaurants/orders'),
  
  updateOrderStatus: (orderId, status) =>
    api.put(`/restaurants/orders/${orderId}`, { status }),
  
  getOrderDetails: (orderId) =>
    api.get(`/restaurants/orders/${orderId}`),

  // Menu Items Management
  getMenuItems: () =>
    api.get('/restaurants/menu'),
  
  addMenuItem: (itemData) =>
    api.post('/restaurants/menu', itemData),
  
  updateMenuItem: (itemId, itemData) =>
    api.put(`/restaurants/menu/${itemId}`, itemData),
  
  deleteMenuItem: (itemId) =>
    api.delete(`/restaurants/menu/${itemId}`),

  // Restaurant Stats & Profile
  getRestaurantStats: () =>
    api.get('/restaurants/stats'),
  
  getRestaurantProfile: () =>
    api.get('/restaurants/profile'),
  
  updateRestaurantProfile: (profileData) =>
    api.put('/restaurants/profile', profileData),

  // Dashboard Analytics
  getOrderAnalytics: (filter = {}) =>
    api.get('/restaurants/analytics', { params: filter }),
  
  getTopMenuItems: () =>
    api.get('/restaurants/menu/analytics/top'),
  
  getDeliveryMetrics: () =>
    api.get('/restaurants/analytics/delivery')
};

export default restaurantDashboardService;
