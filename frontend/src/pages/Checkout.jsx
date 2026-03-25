import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';
import customerService from '../services/customerService';
import orderService from '../services/orderService';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, restaurantId, totalAmount, deliveryFee } = useSelector(state => state.cart);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
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

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    fetchAddresses();
  }, [isAuthenticated, items.length, navigate]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAddresses();
      setAddresses(response);
      if (response.length > 0) {
        const default_address = response.find(addr => addr.isDefault);
        setSelectedAddressId(default_address?._id || response[0]._id);
      }
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

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }

    try {
      setPlacing(true);
      setError('');

      const orderData = {
        restaurantId,
        items: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        deliveryAddressId: selectedAddressId,
        paymentMethod,
        notes: ''
      };

      const response = await orderService.createOrder(orderData);
      
      // Navigate to payment page with order details
      navigate(`/payment/${response._id}`, {
        state: { order: response }
      });
    } catch (err) {
      setError(err.message || 'Failed to place order');
      console.error(err);
    } finally {
      setPlacing(false);
    }
  };

  const finalTotal = totalAmount + (deliveryFee || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-4xl text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-8"
        >
          <FiArrowLeft />
          <span>Back to Cart</span>
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Delivery Address Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Delivery Address</h2>

              {addresses.length > 0 && (
                <div className="space-y-3 mb-6">
                  {addresses.map(address => (
                    <label key={address._id} className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition">
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddressId === address._id}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="mt-1 w-4 h-4 text-orange-600 cursor-pointer"
                      />
                      <div className="ml-4">
                        <p className="font-semibold text-gray-800 capitalize">{address.type}</p>
                        <p className="text-gray-600 text-sm">
                          {address.street}, {address.city}, {address.state} {address.zipCode}
                        </p>
                        {address.landmark && (
                          <p className="text-gray-500 text-sm">Landmark: {address.landmark}</p>
                        )}
                        {address.isDefault && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 border-2 border-orange-200 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Add New Address</h3>
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
                        className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-medium"
                      >
                        Save Address
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

              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  + Add New Address
                </button>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Method</h2>

              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600 cursor-pointer"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">Cash on Delivery</p>
                    <p className="text-gray-600 text-sm">Pay when your order arrives</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    disabled
                    className="w-4 h-4 text-gray-400 cursor-not-allowed"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">UPI (Coming Soon)</p>
                    <p className="text-gray-600 text-sm">Pay securely via UPI</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    disabled
                    className="w-4 h-4 text-gray-400 cursor-not-allowed"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">Credit/Debit Card (Coming Soon)</p>
                    <p className="text-gray-600 text-sm">Pay via card</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-2 mb-6 pb-6 border-b border-gray-200 max-h-48 overflow-y-auto">
                {items.map(item => (
                  <div key={item.menuItemId} className="flex justify-between text-sm text-gray-700">
                    <span>{item.itemName} × {item.quantity}</span>
                    <span>₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span>₹{(deliveryFee || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-800 mb-6">
                <span>Total</span>
                <span className="text-orange-600">₹{finalTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing || !selectedAddressId}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition font-bold text-lg flex items-center justify-center space-x-2"
              >
                {placing && <FiLoader className="animate-spin" />}
                <span>{placing ? 'Processing...' : 'Proceed to Payment'}</span>
              </button>

              <p className="text-gray-500 text-xs mt-4 text-center">
                By proceeding to payment, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
