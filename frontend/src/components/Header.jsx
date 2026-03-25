import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../redux/slices/authSlice';
import { FiShoppingCart, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate('/');
  };

  const cartCount = items.length;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition">
          🍕 FoodApp
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-orange-600 transition font-medium">
            Home
          </Link>
          <a href="#" className="text-gray-700 hover:text-orange-600 transition font-medium">
            About
          </a>
          <a href="#" className="text-gray-700 hover:text-orange-600 transition font-medium">
            Contact
          </a>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <Link to="/cart" className="relative flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition">
              <FiShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
              <span className="hidden md:inline">Cart</span>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition"
              >
                <FiUser className="text-2xl" />
                <span className="hidden md:inline text-sm">{user?.fullName || 'Profile'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <FiLogOut className="text-lg" />
                <span className="hidden md:inline text-sm">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              <FiLogIn className="text-lg" />
              <span className="hidden md:inline text-sm">Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
