import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentRestaurant, setMenu, setLoading } from '../redux/slices/restaurantSlice';
import { addToCart, setRestaurant } from '../redux/slices/cartSlice';
import { restaurantService } from '../services/restaurantService';
import { FiArrowLeft, FiStar, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRestaurant, menu, loading } = useSelector(state => state.restaurants);
  const { items } = useSelector(state => state.cart);
  const [expanded, setExpanded] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    dispatch(setLoading(true));
    try {
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantService.getRestaurantById(id),
        restaurantService.getRestaurantMenu(id)
      ]);
      
      // Response is already data due to axios interceptor
      dispatch(setCurrentRestaurant(restaurantRes));
      dispatch(setMenu(menuRes.menu));
      dispatch(setRestaurant({ id, name: restaurantRes.restaurantName }));
    } catch (error) {
      console.error('Failed to fetch restaurant details:', error);
    }
  };

  const handleQuantityChange = (itemId, change) => {
    setQuantities(prev => {
      const current = prev[itemId] || 0;
      const newQuantity = Math.max(0, current + change);
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;
    if (quantity > 0) {
      dispatch(addToCart({
        menuItemId: item._id,
        itemName: item.itemName,
        unitPrice: item.price,
        quantity: quantity
      }));
      setQuantities(prev => ({ ...prev, [item._id]: 0 }));
    }
  };

  const cartCount = items.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (!currentRestaurant) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft /> Back
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 btn-primary relative"
          >
            <FiShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            Cart ({cartCount})
          </button>
        </div>
      </div>

      {/* Restaurant Banner */}
      <div className="relative h-64 bg-gray-300">
        <img
          src={currentRestaurant.bannerImageUrl || 'https://via.placeholder.com/1200x300'}
          alt={currentRestaurant.restaurantName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Restaurant Info */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {currentRestaurant.restaurantName}
            </h1>
            <p className="text-gray-600 text-lg mb-4">{currentRestaurant.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FiStar className="text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{currentRestaurant.ratingAverage.toFixed(1)}</span>
              </div>
              <span className="text-gray-600">Delivery: ${currentRestaurant.deliveryFee}</span>
              <span className="text-gray-600">Min Order: ${currentRestaurant.minOrderValue}</span>
            </div>
          </div>
          <img
            src={currentRestaurant.logoUrl || 'https://via.placeholder.com/100x100'}
            alt="logo"
            className="w-24 h-24 rounded-lg"
          />
        </div>

        {/* Menu */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Menu</h2>

          {menu.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No menu items available</p>
          ) : (
            <div className="space-y-8">
              {menu.map((category) => (
                <div key={category._id}>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-orange-600">
                    {category.categoryName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((item) => (
                      <div key={item._id} className="card p-4">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.itemName}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                          />
                        )}
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          {item.itemName}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3 min-h-10">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-orange-600">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ~{item.preparationTime}min
                          </span>
                        </div>

                        {!item.isAvailable ? (
                          <button disabled className="w-full btn-danger opacity-50 cursor-not-allowed">
                            Out of Stock
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item._id, -1)}
                              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
                            >
                              <FiMinus className="w-4 h-4 mx-auto" />
                            </button>
                            <span className="flex-1 text-center font-semibold">
                              {quantities[item._id] || 0}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, 1)}
                              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
                            >
                              <FiPlus className="w-4 h-4 mx-auto" />
                            </button>
                            <button
                              onClick={() => handleAddToCart(item)}
                              disabled={!quantities[item._id] || quantities[item._id] === 0}
                              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetail;
