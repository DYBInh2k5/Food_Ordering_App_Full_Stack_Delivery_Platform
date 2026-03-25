import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import restaurantService from '../services/restaurantService';
import { FiArrowLeft, FiLoader, FiCheckCircle, FiClock, FiTrendingUp, FiEdit, FiPlus, FiX } from 'react-icons/fi';

function RestaurantDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const [tab, setTab] = useState('orders'); // orders, menu, stats
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [newItemForm, setNewItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main_course',
    image: '',
    vegetarian: false,
    spicy: false
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'restaurant') {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, menuRes, statsRes] = await Promise.all([
        restaurantService.getRestaurantOrders(),
        restaurantService.getMenuItems(),
        restaurantService.getRestaurantStats()
      ]);

      setOrders(ordersRes.orders || []);
      setMenuItems(menuRes || []);
      setStats(statsRes || {});
      setError('');
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await restaurantService.updateOrderStatus(orderId, newStatus);
      await fetchDashboardData();
      setSelectedOrder(null);
    } catch (err) {
      setError(err.message || 'Failed to update order');
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      if (!newItemForm.name || !newItemForm.price) {
        setError('Name and price are required');
        return;
      }

      const itemData = {
        ...newItemForm,
        price: parseFloat(newItemForm.price)
      };

      if (editingItem) {
        await restaurantService.updateMenuItem(editingItem._id, itemData);
      } else {
        await restaurantService.addMenuItem(itemData);
      }

      setNewItemForm({
        name: '',
        description: '',
        price: '',
        category: 'main_course',
        image: '',
        vegetarian: false,
        spicy: false
      });
      setEditingItem(null);
      setShowAddItem(false);
      await fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to save menu item');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItemForm(item);
    setShowAddItem(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this menu item?')) return;

    try {
      await restaurantService.deleteMenuItem(itemId);
      await fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to delete item');
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-4xl text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading restaurant dashboard...</p>
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

        {/* Restaurant Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800">{stats?.totalOrders || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">₹{stats?.totalRevenue?.toFixed(2) || '0'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Rating</p>
            <p className="text-3xl font-bold text-yellow-500">⭐ {stats?.rating || '5.0'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Active Orders</p>
            <p className="text-3xl font-bold text-blue-600">{orders.filter(o => o.status !== 'delivered').length}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setTab('orders')}
            className={`px-6 py-3 font-medium transition ${
              tab === 'orders'
                ? 'border-b-2 border-orange-600 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiClock className="inline mr-2" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setTab('menu')}
            className={`px-6 py-3 font-medium transition ${
              tab === 'menu'
                ? 'border-b-2 border-orange-600 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiEdit className="inline mr-2" />
            Menu ({menuItems.length})
          </button>
          <button
            onClick={() => setTab('stats')}
            className={`px-6 py-3 font-medium transition ${
              tab === 'stats'
                ? 'border-b-2 border-orange-600 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiTrendingUp className="inline mr-2" />
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map(order => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Order #{order.orderNumber}</p>
                      <p className="text-2xl font-bold text-gray-800">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'on_the_way'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Items</p>
                      {order.items?.map((item, idx) => (
                        <p key={idx} className="text-gray-800 text-sm">
                          {item.name} x{item.quantity}
                        </p>
                      ))}
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Customer</p>
                      <p className="text-gray-800">{order.customerId?.name}</p>
                      <p className="text-gray-600 text-sm">{order.customerId?.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Delivery Address</p>
                      <p className="text-gray-800 text-sm">{order.deliveryAddress?.street}</p>
                      <p className="text-gray-600 text-xs">{order.deliveryAddress?.city}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No orders yet</p>
              </div>
            )}
          </div>
        )}

        {tab === 'menu' && (
          <div>
            <button
              onClick={() => {
                setShowAddItem(!showAddItem);
                setEditingItem(null);
                setNewItemForm({
                  name: '',
                  description: '',
                  price: '',
                  category: 'main_course',
                  image: '',
                  vegetarian: false,
                  spicy: false
                });
              }}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition mb-6 flex items-center space-x-2"
            >
              <FiPlus />
              <span>Add New Item</span>
            </button>

            {showAddItem && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                <form onSubmit={handleAddMenuItem} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={newItemForm.name}
                      onChange={e => setNewItemForm({ ...newItemForm, name: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
                      required
                    />
                    <select
                      value={newItemForm.category}
                      onChange={e => setNewItemForm({ ...newItemForm, category: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
                    >
                      <option value="main_course">Main Course</option>
                      <option value="appetizer">Appetizer</option>
                      <option value="dessert">Dessert</option>
                      <option value="beverage">Beverage</option>
                    </select>
                  </div>

                  <textarea
                    placeholder="Description"
                    value={newItemForm.description}
                    onChange={e => setNewItemForm({ ...newItemForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
                    rows="3"
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Price"
                      step="0.01"
                      value={newItemForm.price}
                      onChange={e => setNewItemForm({ ...newItemForm, price: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={newItemForm.image}
                      onChange={e => setNewItemForm({ ...newItemForm, image: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newItemForm.vegetarian}
                        onChange={e => setNewItemForm({ ...newItemForm, vegetarian: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-gray-700">Vegetarian</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newItemForm.spicy}
                        onChange={e => setNewItemForm({ ...newItemForm, spicy: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-gray-700">Spicy</span>
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddItem(false);
                        setEditingItem(null);
                      }}
                      className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map(item => (
                <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-xl font-bold text-orange-600">₹{item.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-2">
                        {item.vegetarian && <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Veg</span>}
                        {item.spicy && <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">🌶️</span>}
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'stats' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Average Order Value</span>
                  <span className="font-bold">₹{(stats?.totalRevenue / (stats?.totalOrders || 1)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Total Revenue</span>
                  <span className="font-bold">₹{stats?.totalRevenue?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Completed Orders</span>
                  <span className="font-bold">{orders.filter(o => o.status === 'completed').length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">⭐ Rating</h3>
              <div className="text-center">
                <p className="text-5xl font-bold text-yellow-500 mb-2">
                  {stats?.rating || '5.0'}
                </p>
                <p className="text-gray-600">out of 5 stars</p>
                <p className="text-gray-500 text-sm mt-2">
                  Based on {stats?.totalOrders || 0} orders
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 text-sm">Order #{selectedOrder.orderNumber}</p>
                <p className="text-2xl font-bold text-gray-800">₹{selectedOrder.totalAmount.toFixed(2)}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Items</h3>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="text-gray-700 text-sm">
                    {item.name} x{item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Customer Info</h3>
                <p className="text-gray-700">{selectedOrder.customerId?.name}</p>
                <p className="text-gray-600 text-sm">{selectedOrder.customerId?.phoneNumber}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Delivery Address</h3>
                <p className="text-gray-700">{selectedOrder.deliveryAddress?.street}</p>
                <p className="text-gray-700">{selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.zipCode}</p>
              </div>

              {selectedOrder.status !== 'completed' && (
                <div className="flex space-x-4">
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'preparing')}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Start Preparing
                    </button>
                  )}
                  {selectedOrder.status === 'preparing' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'ready')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Mark Ready for Pickup
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantDashboard;
