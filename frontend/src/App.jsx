import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import DriverDashboard from './pages/DriverDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import ReviewForm from './pages/ReviewForm';

function App() {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={isAuthenticated ? <Checkout /> : <Navigate to="/login" />} />
            <Route path="/payment/:orderId" element={isAuthenticated ? <Payment /> : <Navigate to="/login" />} />
            <Route path="/payment-success/:orderId" element={isAuthenticated ? <PaymentSuccess /> : <Navigate to="/login" />} />
            <Route path="/order/:orderId" element={isAuthenticated ? <OrderDetails /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />
            <Route path="/review/:type/:id" element={isAuthenticated ? <ReviewForm /> : <Navigate to="/login" />} />
            <Route path="/driver-dashboard" element={isAuthenticated ? <DriverDashboard /> : <Navigate to="/login" />} />
            <Route path="/restaurant-dashboard" element={isAuthenticated ? <RestaurantDashboard /> : <Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  );
}

export default App;
