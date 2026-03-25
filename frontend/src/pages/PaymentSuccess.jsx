import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiCheckCircle, FiDownload, FiHome, FiArrowRight } from 'react-icons/fi';

function PaymentSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (location.state?.order && location.state?.payment) {
      setOrder(location.state.order);
      setPayment(location.state.payment);
    }
  }, [isAuthenticated, location, navigate]);

  const handleDownloadReceipt = () => {
    // Generate receipt content
    const receiptContent = `
ORDER RECEIPT
═════════════════════════════════════════

Order Number: ${order?.orderNumber}
Order Date: ${order?.createdAt ? new Date(order.createdAt).toLocaleString() : ''}

Customer Details:
─────────────────────────────────────────

Delivery Address:
${order?.deliveryAddress?.street}
${order?.deliveryAddress?.city}, ${order?.deliveryAddress?.state} ${order?.deliveryAddress?.zipCode}

Order Items:
─────────────────────────────────────────
${order?.items?.map(item => `${item.menuItemId?.itemName || 'Item'} × ${item.quantity} .................. ₹${(item.unitPrice * item.quantity).toFixed(2)}`).join('\n')}

Price Summary:
─────────────────────────────────────────
Subtotal: ₹${((order?.totalAmount || 0) - (order?.deliveryFee || 0)).toFixed(2)}
Delivery Fee: ₹${(order?.deliveryFee || 0).toFixed(2)}
─────────────────────────────────────────
Total Amount: ₹${order?.totalAmount.toFixed(2)}

Payment Details:
─────────────────────────────────────────
Transaction ID: ${payment?.transactionId}
Payment Method: ${payment?.paymentMethod}
Payment Status: ${payment?.status}
Payment Date: ${payment?.completedAt ? new Date(payment.completedAt).toLocaleString() : new Date().toLocaleString()}

═════════════════════════════════════════
Thank you for your order!
Estimated Delivery: 30-45 minutes
    `;

    // Create and download file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptContent));
    element.setAttribute('download', `receipt_${order?.orderNumber}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!order || !payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600">Loading payment confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
            <FiCheckCircle className="text-5xl text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 text-lg">Your order has been confirmed and is being prepared</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          {/* Order Number */}
          <div className="text-center mb-8 pb-8 border-b border-gray-200">
            <p className="text-gray-600 text-sm mb-2">ORDER NUMBER</p>
            <h2 className="text-3xl font-bold text-gray-800 font-mono">{order.orderNumber}</h2>
          </div>

          {/* Items Summary */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{item.menuItemId?.itemName || 'Item'}</p>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">Delivery Address</h3>
            <p className="text-gray-700">
              {order.deliveryAddress?.street}<br />
              {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}
            </p>
            {order.deliveryAddress?.landmark && (
              <p className="text-gray-600 text-sm mt-2">Landmark: {order.deliveryAddress.landmark}</p>
            )}
          </div>

          {/* Payment Details */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">Payment Details</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{((order.totalAmount) - (order.deliveryFee || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{(order.deliveryFee || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Transaction Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <h3 className="font-bold text-gray-800 mb-3">Transaction Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Transaction ID</span>
                <span className="font-mono text-gray-800">{payment.transactionId}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Payment Method</span>
                <span className="capitalize text-gray-800">{payment.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Payment Time</span>
                <span className="text-gray-800">
                  {payment.completedAt ? new Date(payment.completedAt).toLocaleString() : new Date().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Status</span>
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold capitalize">
                  {payment.status}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <FiDownload />
              <span>Download Receipt</span>
            </button>
            <button
              onClick={() => navigate(`/order/${orderId}`)}
              className="flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-medium"
            >
              <span>Track Order</span>
              <FiArrowRight />
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-blue-900 mb-2">What Happens Next?</h3>
          <ol className="text-blue-900 text-sm space-y-2 list-decimal list-inside">
            <li>Your order has been confirmed</li>
            <li>The restaurant will start preparing your food</li>
            <li>You'll receive a notification when your order is ready for delivery</li>
            <li>A delivery partner will pick up your order and deliver it to your address</li>
            <li>Typical delivery time is 30-45 minutes</li>
          </ol>
        </div>

        {/* Continue Shopping Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-lg hover:shadow-lg transition font-bold text-lg"
        >
          <FiHome />
          <span>Continue Shopping</span>
        </button>

        {/* Thank You Message */}
        <div className="text-center mt-8 text-gray-600">
          <p>Thank you for ordering with us! 🙏</p>
          <p className="text-sm mt-2">For any issues, contact us at support@foodapp.com</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
