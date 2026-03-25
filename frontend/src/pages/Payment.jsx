import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import paymentService from '../services/paymentService';
import { FiArrowLeft, FiLoader, FiCheck, FiX, FiCreditCard, FiUmbrella } from 'react-icons/fi';

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [paymentStatus, setPaymentStatus] = useState(null); // 'pending', 'success', 'failed'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!location.state?.order) {
      navigate('/orders');
      return;
    }

    setOrder(location.state.order);
    setLoading(false);
  }, [isAuthenticated, location, navigate]);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number (add spaces every 4 digits)
    if (name === 'cardNumber') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').substring(0, 16);
      const parts = [];
      for (let i = 0; i < v.length; i += 4) {
        parts.push(v.substring(i, i + 4));
      }
      setCardDetails({ ...cardDetails, [name]: parts.join(' ') });
      return;
    }

    // Format expiry (MM/YY)
    if (name === 'expiryMonth') {
      const v = value.substring(0, 2);
      setCardDetails({ ...cardDetails, [name]: v });
      return;
    }

    if (name === 'expiryYear') {
      const v = value.substring(0, 2);
      setCardDetails({ ...cardDetails, [name]: v });
      return;
    }

    // CVV (3-4 digits)
    if (name === 'cvv') {
      const v = value.replace(/[^0-9]/gi, '').substring(0, 4);
      setCardDetails({ ...cardDetails, [name]: v });
      return;
    }

    setCardDetails({ ...cardDetails, [name]: value });
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardName.trim()) {
      setError('Cardholder name is required');
      return false;
    }
    if (!cardDetails.cardNumber.replace(/\s/g, '') || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
      setError('Please enter expiry date');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!order) {
      setError('Order information not found');
      return;
    }

    // Validate form based on payment method
    if (paymentMethod === 'card' && !validateCardDetails()) {
      return;
    }

    try {
      setProcessing(true);

      // Step 1: Create payment intent
      const intentResponse = await paymentService.createPaymentIntent(
        order._id,
        order.totalAmount,
        paymentMethod
      );

      const paymentId = intentResponse.paymentId;
      setPayment(intentResponse);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 2: Mock successful payment confirmation
      // In real implementation with Stripe, you would process the actual payment here
      const confirmResponse = await paymentService.confirmPayment(paymentId, 'completed');

      // Payment successful
      setPaymentStatus('success');
      
      // Store payment details
      setPayment(confirmResponse.data.payment);

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate(`/payment-success/${orderId}`, {
          state: {
            payment: confirmResponse.data.payment,
            order: confirmResponse.data.order
          }
        });
      }, 2000);
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentStatus('failed');
      setError(err.message || 'Payment failed. Please try again.');
      
      // Try to update payment status to failed
      if (payment?.paymentId) {
        try {
          await paymentService.confirmPayment(payment.paymentId, 'failed');
        } catch (e) {
          console.error('Failed to update payment status:', e);
        }
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-4xl text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-8"
          >
            <FiArrowLeft />
            <span>Back to Orders</span>
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            Order not found. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/order/${orderId}`)}
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-8"
        >
          <FiArrowLeft />
          <span>Back to Order</span>
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-3">
            <FiX className="text-xl flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Payment Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-3">
            <FiCheck className="text-2xl flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Payment Successful!</h3>
              <p className="text-sm">Your payment has been processed. Redirecting...</p>
            </div>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Payment Failed</p>
            <p className="text-sm">Please try again or use a different payment method.</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>

              <form onSubmit={handlePayment}>
                {/* Payment Method Selection */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-800 mb-4">Select Payment Method</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-orange-600 cursor-pointer"
                        disabled={processing}
                      />
                      <FiCreditCard className="text-xl text-gray-600 ml-3" />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-800">Credit/Debit Card</p>
                        <p className="text-gray-600 text-sm">Visa, Mastercard, Amex</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer opacity-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        disabled
                        className="w-4 h-4 text-gray-400 cursor-not-allowed"
                      />
                      <FiUmbrella className="text-xl text-gray-400 ml-3" />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-800">UPI</p>
                        <p className="text-gray-600 text-sm">Coming Soon</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Card Details Form */}
                {paymentMethod === 'card' && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Card Information</h3>

                    <div className="space-y-4">
                      {/* Cardholder Name */}
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          placeholder="John Doe"
                          value={cardDetails.cardName}
                          onChange={handleCardInputChange}
                          disabled={processing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 disabled:bg-gray-100"
                          required
                        />
                      </div>

                      {/* Card Number */}
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={handleCardInputChange}
                          disabled={processing}
                          maxLength="19"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 disabled:bg-gray-100 font-mono"
                          required
                        />
                        <p className="text-gray-500 text-xs mt-1">16 digits, no spaces</p>
                      </div>

                      {/* Expiry & CVV */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Expiry Date
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="expiryMonth"
                              placeholder="MM"
                              value={cardDetails.expiryMonth}
                              onChange={handleCardInputChange}
                              disabled={processing}
                              maxLength="2"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 disabled:bg-gray-100 text-center"
                              required
                            />
                            <span className="text-gray-400 pt-2">/</span>
                            <input
                              type="text"
                              name="expiryYear"
                              placeholder="YY"
                              value={cardDetails.expiryYear}
                              onChange={handleCardInputChange}
                              disabled={processing}
                              maxLength="2"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 disabled:bg-gray-100 text-center"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={handleCardInputChange}
                            disabled={processing}
                            maxLength="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 disabled:bg-gray-100 text-center font-mono"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full mt-8 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition font-bold text-lg flex items-center justify-center space-x-2"
                >
                  {processing && <FiLoader className="animate-spin" />}
                  <span>
                    {processing ? 'Processing Payment...' : `Pay ₹${order.totalAmount.toFixed(2)}`}
                  </span>
                </button>

                <p className="text-gray-500 text-xs mt-4 text-center">
                  Your payment information is secure and encrypted
                </p>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-gray-600 text-sm">Order Number</p>
                <p className="font-bold text-gray-800 text-lg">{order.orderNumber}</p>
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b border-gray-200 max-h-48 overflow-y-auto">
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-700">
                    <span>{item.menuItemId?.itemName || 'Item'} × {item.quantity}</span>
                    <span>₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{((order.totalAmount) - (order.deliveryFee || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span>₹{(order.deliveryFee || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span className="text-orange-600">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
