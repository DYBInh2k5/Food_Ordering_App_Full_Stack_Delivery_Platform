import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import customerService from '../services/customerService';
import { logoutSuccess } from '../redux/slices/authSlice';
import { FiEdit2, FiTrash2, FiPlus, FiLoader, FiLogOut, FiArrowLeft } from 'react-icons/fi';

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    type: 'home'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchAddresses();
  }, [isAuthenticated, navigate]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAddresses();
      setAddresses(response);
      setError('');
    } catch (err) {
      setError('Failed to load addresses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await customerService.addAddress(newAddress);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        landmark: '',
        type: 'home'
      });
      setShowAddressForm(false);
      await fetchAddresses();
    } catch (err) {
      setError('Failed to add address');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      setLoading(true);
      await customerService.deleteAddress(addressId);
      await fetchAddresses();
    } catch (err) {
      setError('Failed to delete address');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user?.fullName}</h1>
              <p className="text-gray-600 mt-2">{user?.email}</p>
              {user?.phoneNumber && (
                <p className="text-gray-600">{user?.phoneNumber}</p>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                My Orders
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              <strong>Account Type:</strong> <span className="capitalize">{user?.role}</span>
            </p>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                <FiPlus />
                <span>Add Address</span>
              </button>
            )}
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="mb-6 p-6 border-2 border-orange-200 rounded-lg bg-orange-50">
              <h3 className="font-bold text-gray-800 mb-4">Add New Address</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600"
                    required
                  />
                  <select
                    value={newAddress.type}
                    onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Landmark (optional)"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600"
                />
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition font-medium flex items-center justify-center space-x-2"
                  >
                    {loading && <FiLoader className="animate-spin" />}
                    <span>Save Address</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <FiLoader className="text-2xl text-orange-600 animate-spin" />
            </div>
          ) : addresses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map(address => (
                <div
                  key={address._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-orange-400 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-800 capitalize">{address.type}</h3>
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm mb-1">{address.street}</p>
                  <p className="text-gray-700 text-sm mb-3">
                    {address.city}, {address.state} {address.zipCode}
                  </p>

                  {address.landmark && (
                    <p className="text-gray-600 text-sm mb-3">
                      <strong>Landmark:</strong> {address.landmark}
                    </p>
                  )}

                  <div className="flex space-x-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setEditingAddressId(address._id);
                        // TODO: Implement edit functionality
                      }}
                      className="flex-1 flex items-center justify-center space-x-1 text-blue-600 hover:text-blue-700 py-1 transition"
                    >
                      <FiEdit2 className="text-lg" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="flex-1 flex items-center justify-center space-x-1 text-red-600 hover:text-red-700 py-1 transition"
                    >
                      <FiTrash2 className="text-lg" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No addresses saved yet. Add your first address to start ordering.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
