import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import driverService from '../services/driverService';
import { FiArrowLeft, FiLoader, FiMapPin, FiClock, FiCheckCircle, FiPhone, FiMap, FiHistory } from 'react-icons/fi';

function DriverDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const [tab, setTab] = useState('available'); // available, active, history
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [driverProfile, setDriverProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'driver') {
      navigate('/login');
      return;
    }

    fetchDashboardData();
    
    // Get user's location and update every 10 seconds
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          updateDriverLocation(latitude, longitude);
        },
        error => console.error('Geolocation error:', error)
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, ordersRes, activeRes, historyRes] = await Promise.all([
        driverService.getDriverProfile(),
        driverService.getAvailableOrders(),
        driverService.getActiveDelivery(),
        driverService.getDeliveryHistory()
      ]);

      setDriverProfile(profileRes);
      setAvailableOrders(ordersRes);
      setActiveDelivery(activeRes);
      setDeliveryHistory(historyRes.deliveries || []);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateDriverLocation = async (latitude, longitude) => {
    try {
      await driverService.updateLocation(latitude, longitude);
    } catch (err) {
      console.error('Failed to update location:', err);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      setLoading(true);
      await driverService.acceptOrder(orderId);
      await fetchDashboardData();
      setTab('active');
    } catch (err) {
      setError(err.message || 'Failed to accept order');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDelivery = async (orderId) => {
    if (!window.confirm('Mark this delivery as complete?')) return;

    try {
      setLoading(true);
      await driverService.completeDelivery(orderId);
      await fetchDashboardData();
      setTab('history');
    } catch (err) {
      setError(err.message || 'Failed to complete delivery');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !driverProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-4xl text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading driver dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-8"
        >
          <FiArrowLeft />
          <span>Back to Home</span>
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Driver Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Total Deliveries</p>
              <p className="text-3xl font-bold text-gray-800">{driverProfile?.completedDeliveries || 0}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Driver Rating</p>
              <p className="text-3xl font-bold text-yellow-500">⭐ {driverProfile?.rating || 5}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Current Location</p>
              <p className="text-sm text-gray-800">
                {currentLocation ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}` : 'Updating...'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setTab('available')}
            className={`px-6 py-3 font-medium transition ${
              tab === 'available'
                ? 'border-b-2 border-orange-600 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Available Orders ({availableOrders.length})
          </button>
          <button
            onClick={() => setTab('active')}
            className={`px-6 py-3 font-medium transition ${
              tab === 'active'
                ? 'border-b-2 border-orange-600 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Active Delivery
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-6 py-3 font-medium transition ${
              tab === 'history'
                ? 'border-b-2 border-orange-600 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiHistory className="inline mr-2" />
            History
          </button>
        </div>

        {/* Tab Content */}
        {tab === 'available' && (
          <div className="space-y-4">
            {availableOrders.length > 0 ? (
              availableOrders.map(order => (
                <div key={order._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Order Number</p>
                      <p className="font-bold text-lg text-gray-800">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Restaurant</p>
                      <p className="font-medium text-gray-800">{order.restaurantId?.restaurantName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Delivery Fee</p>
                      <p className="font-bold text-orange-600">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Customer Contact</p>
                      <p className="font-medium text-gray-800">{order.customerId?.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm flex items-center space-x-2 mb-2">
                        <FiMapPin />
                        <span>Pickup: {order.restaurantId?.address}</span>
                      </p>
                      <p className="text-gray-600 text-sm flex items-center space-x-2">
                        <FiMapPin />
                        <span>Delivery: {order.deliveryAddress?.street}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition whitespace-nowrap"
                    >
                      Accept Order
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No available orders at the moment</p>
                <p className="text-gray-500 text-sm mt-2">New orders will appear here</p>
              </div>
            )}
          </div>
        )}

        {tab === 'active' && (
          <div>
            {activeDelivery ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Delivery</h2>
                  
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                    <p className="text-blue-900 font-medium mb-2">Order: {activeDelivery.orderId?.orderNumber}</p>
                    <p className="text-blue-800">Status: <span className="font-semibold">On the Way</span></p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-600 text-sm flex items-center space-x-2 mb-2">
                        <FiMapPin />
                        <span>Pickup Location</span>
                      </p>
                      <p className="font-medium text-gray-800">
                        {activeDelivery.pickupLocation?.restaurantName}
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-600 text-sm flex items-center space-x-2 mb-2">
                        <FiMapPin />
                        <span>Delivery Location</span>
                      </p>
                      <p className="font-medium text-gray-800">
                        {activeDelivery.deliveryLocation?.street}
                      </p>
                    </div>
                  </div>

                  {currentLocation && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <p className="text-gray-700 text-sm font-medium mb-2">📍 Your Current Location</p>
                      <p className="text-gray-600 font-mono text-sm">
                        {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleCompleteDelivery(activeDelivery.orderId?._id)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold flex items-center justify-center space-x-2"
                  >
                    <FiCheckCircle />
                    <span>Mark As Delivered</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No active deliveries</p>
                <p className="text-gray-500 text-sm mt-2">Accept an order to start delivery</p>
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-4">
            {deliveryHistory.length > 0 ? (
              deliveryHistory.map(delivery => (
                <div key={delivery._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Order Number</p>
                      <p className="font-bold text-lg text-gray-800">{delivery.orderId?.orderNumber}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <FiCheckCircle />
                      <span>Delivered</span>
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-gray-700">
                    <div>
                      <p className="text-gray-600 text-sm">Order Amount</p>
                      <p className="font-semibold">₹{delivery.orderId?.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Delivery Status</p>
                      <p className="font-semibold capitalize">{delivery.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Delivered At</p>
                      <p className="font-semibold">
                        {delivery.deliveredAt ? new Date(delivery.deliveredAt).toLocaleDateString() : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No delivery history yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DriverDashboard;
