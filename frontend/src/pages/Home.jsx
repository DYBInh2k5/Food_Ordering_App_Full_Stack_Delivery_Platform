import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setRestaurants, setLoading, setError, setSearchQuery } from '../redux/slices/restaurantSlice';
import { restaurantService } from '../services/restaurantService';
import { FiSearch, FiStar, FiMapPin, FiClock } from 'react-icons/fi';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { restaurants, loading, filters } = useSelector(state => state.restaurants);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, [filters.page, filters.search]);

  const fetchRestaurants = async () => {
    dispatch(setLoading(true));
    try {
      const response = await restaurantService.getAllRestaurants({
        search: filters.search,
        page: filters.page,
        limit: filters.limit
      });
      // Response is already the data due to axios interceptor
      dispatch(setRestaurants(response));
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch restaurants'));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchInput));
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">🍕 FoodApp</h1>
            <p className="text-xl text-orange-100 mb-8">Order your favorite food from the best restaurants</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search for restaurants..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-orange-600 text-white px-6 py-1 rounded-lg hover:bg-orange-700 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          {filters.search ? `Results for "${filters.search}"` : 'Popular Restaurants'}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
              <p className="text-gray-600">Loading restaurants...</p>
            </div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => handleRestaurantClick(restaurant._id)}
                className="card cursor-pointer overflow-hidden group"
              >
                {/* Restaurant Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={restaurant.bannerImageUrl || 'https://via.placeholder.com/400x200?text=' + restaurant.restaurantName}
                    alt={restaurant.restaurantName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                    <FiStar className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-gray-800">{restaurant.ratingAverage.toFixed(1)}</span>
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                    {restaurant.restaurantName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>

                  {/* Info Row */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      <span>{restaurant.openingTime} - {restaurant.closingTime}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Delivery: ${restaurant.deliveryFee}
                    </div>
                    <div className="text-sm text-gray-600">
                      Min: ${restaurant.minOrderValue}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
