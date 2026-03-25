import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import orderService from '../services/orderService';
import { FiCheckCircle, FiClock, FiTruck, FiHome, FiLoader, FiArrowLeft } from 'react-icons/fi';

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const successMessage = location.state?.message;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [orderId, isAuthenticated, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(orderId);
      // The response is already the data object due to axios interceptor
      setOrder(response);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { status: 'pending', label: 'Order Placed', icon: FiCheckCircle },
      { status: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
      { status: 'preparing', label: 'Preparing', icon: FiClock },
      { status: 'ready', label: 'Ready', icon: FiCheckCircle },
      { status: 'on_the_way', label: 'On the Way', icon: FiTruck },
      { status: 'delivered', label: 'Delivered', icon: FiHome }
    ];
    return steps;
  };

  const getStatusIndex = (status) => {
    return getStatusSteps().findIndex(step => step.status === status);
  };

  const statusIndex = order ? getStatusIndex(order.status) : -1;

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-4xl text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-8"
          >
            <FiArrowLeft />
            <span>Back to Home</span>
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-8"
        >
          <FiArrowLeft />
          <span>Back to Home</span>
        </button>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-3">
            <FiCheckCircle className="text-2xl flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Order Confirmed!</h3>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {order && (
          <>
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm">Order Number</p>
                  <h2 className="text-2xl font-bold text-gray-800">{order.orderNumber}</h2>
                  <p className="text-gray-600 text-sm mt-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm">Total Amount</p>
                  <p className="text-3xl font-bold text-orange-600">₹{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Order Status</h3>
              
              <div className="space-y-4">
                {getStatusSteps().map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= statusIndex;
                  const isActive = index === statusIndex;

                  return (
                    <div key={step.status} className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${
                            isCompleted
                              ? 'bg-orange-600 border-orange-600 text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}
                        >
                          <Icon className="text-lg" />
                        </div>
                        {index < getStatusSteps().length - 1 && (
                          <div
                            className={`h-12 w-1 mt-2 ${
                              isCompleted ? 'bg-orange-600' : 'bg-gray-300'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-semibold transition ${
                            isActive
                              ? 'text-orange-600'
                              : isCompleted
                              ? 'text-gray-800'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                        {isActive && (
                          <p className="text-gray-600 text-sm">In progress</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Order Items</h3>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-800">{item.menuItemId?.itemName || 'Item'}</p>
                      <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
                      <p className="text-gray-600 text-sm">₹{item.unitPrice} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {order.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    <strong>Special Instructions:</strong> {order.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Price Breakdown</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{(order.subtotal || order.totalAmount - (order.deliveryFee || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span>₹{(order.deliveryFee || 0).toFixed(2)}</span>
                </div>
                {order.tax && (
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>₹{order.tax.toFixed(2)}</span>
                  </div>
                )}
                {order.discount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total Amount</span>
                  <span className="text-orange-600">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {order.deliveryAddress && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Delivery Address</h3>

                <div className="flex items-start space-x-4">
                  <FiHome className="text-2xl text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800 capitalize">{order.deliveryAddress.type}</p>
                    <p className="text-gray-700">
                      {order.deliveryAddress.street}
                    </p>
                    <p className="text-gray-700">
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                    </p>
                    {order.deliveryAddress.landmark && (
                      <p className="text-gray-600 text-sm mt-1">
                        Landmark: {order.deliveryAddress.landmark}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
