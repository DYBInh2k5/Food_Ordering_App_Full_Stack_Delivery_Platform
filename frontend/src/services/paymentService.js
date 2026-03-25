import api from './api';

const paymentService = {
  // Create payment intent
  createPaymentIntent: (orderId, amount, paymentMethod = 'card') =>
    api.post('/payments/intent', { orderId, amount, paymentMethod }),

  // Confirm payment
  confirmPayment: (paymentId, status = 'completed') =>
    api.post('/payments/confirm', { paymentId, status }),

  // Get payment details
  getPayment: (paymentId) =>
    api.get(`/payments/${paymentId}`),

  // Refund payment
  refundPayment: (paymentId, reason = '') =>
    api.post(`/payments/${paymentId}/refund`, { reason }),

  // Get payment history
  getPayments: (status = null, page = 1, limit = 10) => {
    const params = { page, limit };
    if (status) params.status = status;
    return api.get('/payments', { params });
  }
};

export default paymentService;
