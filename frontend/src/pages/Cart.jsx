import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartItemQuantity, clearCart } from '../redux/slices/cartSlice';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, restaurantId, totalAmount, deliveryFee } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleQuantityChange = (menuItemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartItemQuantity({ menuItemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (menuItemId) => {
    dispatch(removeFromCart(menuItemId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const finalTotal = totalAmount + (deliveryFee || 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-8"
          >
            <FiArrowLeft />
            <span>Back to Restaurants</span>
          </button>

          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Start ordering delicious food from your favorite restaurants</p>
            <button
              onClick={() => navigate('/')}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-medium"
            >
              Browse Restaurants
            </button>
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
          <span>Back to Restaurants</span>
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-orange-600 text-white p-6">
                <h1 className="text-2xl font-bold">Your Order</h1>
                <p className="text-orange-100 mt-2">{items.length} item{items.length !== 1 ? 's' : ''} in cart</p>
              </div>

              <div className="divide-y">
                {items.map(item => (
                  <div key={item.menuItemId} className="p-6 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.itemName}</h3>
                      <p className="text-orange-600 mt-2">₹{item.unitPrice}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.menuItemId, item.quantity - 1)}
                          className="p-2 text-gray-600 hover:text-orange-600"
                        >
                          <FiMinus />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            if (val >= 0) handleQuantityChange(item.menuItemId, val);
                          }}
                          className="w-12 text-center border-0 text-gray-800 font-semibold"
                          min="0"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.menuItemId, item.quantity + 1)}
                          className="p-2 text-gray-600 hover:text-orange-600"
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <p className="w-24 text-right font-semibold text-gray-800">
                        ₹{(item.unitPrice * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => handleRemoveItem(item.menuItemId)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                      >
                        <FiTrash2 className="text-xl" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6">
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

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
                onClick={handleCheckout}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-bold text-lg"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login & Checkout'}
              </button>

              <p className="text-gray-500 text-xs mt-4 text-center">
                Cash on delivery available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
