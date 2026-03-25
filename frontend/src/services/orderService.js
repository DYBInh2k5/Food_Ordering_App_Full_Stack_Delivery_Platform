import apiClient from './api';

export const orderService = {
  createOrder: async (data) => {
    return apiClient.post('/orders', data);
  },

  getOrders: async (params = {}) => {
    return apiClient.get('/orders', { params });
  },

  getOrderById: async (id) => {
    return apiClient.get(`/orders/${id}`);
  },

  updateOrderStatus: async (id, status) => {
    return apiClient.put(`/orders/${id}/status`, { status });
  },

  cancelOrder: async (id) => {
    return apiClient.post(`/orders/${id}/cancel`);
  }
};
