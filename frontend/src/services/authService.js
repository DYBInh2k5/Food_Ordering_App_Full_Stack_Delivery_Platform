import apiClient from './api';

export const authService = {
  register: async (data) => {
    return apiClient.post('/auth/register', data);
  },

  login: async (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },

  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  getProfile: async () => {
    return apiClient.get('/auth/me');
  },

  refreshToken: async () => {
    return apiClient.post('/auth/refresh');
  }
};
