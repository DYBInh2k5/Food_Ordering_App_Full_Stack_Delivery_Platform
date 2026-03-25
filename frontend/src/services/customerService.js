import api from './api';

const customerService = {
  getProfile: () => api.get('/api/v1/customers/profile'),
  
  updateProfile: (data) => api.put('/api/v1/customers/profile', data),
  
  getAddresses: () => api.get('/api/v1/customers/addresses'),
  
  addAddress: (address) => api.post('/api/v1/customers/addresses', address),
  
  updateAddress: (addressId, address) => api.put(`/api/v1/customers/addresses/${addressId}`, address),
  
  deleteAddress: (addressId) => api.delete(`/api/v1/customers/addresses/${addressId}`)
};

export default customerService;
