import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import restaurantSlice from './slices/restaurantSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    restaurants: restaurantSlice
  }
});

export default store;
