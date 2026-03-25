import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { FiArrowLeft, FiLoader, FiChevronRight } from 'react-icons/fi';

function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      // The response is already the data object due to axios interceptor
      setOrders(response.orders || []);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-indigo-100 text-indigo-800';
      case 'on_the_way':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready to Pickup';
      case 'on_the_way':
        return 'On the Way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-4xl text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-8"
        >
          <FiArrowLeft />
          <span>Back to Profile</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
          {['all', 'pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                filterStatus === status
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-600'
              }`}
            >
              {status === 'all' ? 'All Orders' : getStatusLabel(status)}
            </button>
          ))}
        </div>

        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div
                key={order._id}
                onClick={() => navigate(`/order/${order._id}`)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:border-orange-400 border border-transparent transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{order.orderNumber}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                  <div>
                    <p className="text-gray-600 text-sm">Restaurant</p>
                    <p className="font-semibold text-gray-800">
                      {order.restaurantId?.restaurantName || 'Restaurant'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Items</p>
                    <p className="font-semibold text-gray-800">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="font-bold text-orange-600 text-lg">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    {order.paymentMethod && (
                      <p className="text-gray-600 text-sm">
                        Payment: <span className="capitalize font-medium text-gray-800">{order.paymentMethod}</span>
                      </p>
                    )}
                  </div>
                  <FiChevronRight className="text-orange-600 text-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {filterStatus === 'all' ? 'No orders found' : `No ${getStatusLabel(filterStatus).toLowerCase()} orders`}
            </h2>
            <p className="text-gray-600 mb-8">
              {filterStatus === 'all'
                ? 'You haven\'t placed any orders yet. Start ordering from your favorite restaurants!'
                : `You don't have any ${getStatusLabel(filterStatus).toLowerCase()} orders.`}
            </p>
            {filterStatus === 'all' && (
              <button
                onClick={() => navigate('/')}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-medium"
              >
                Browse Restaurants
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
