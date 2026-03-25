import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: null,
  totalAmount: 0,
  deliveryFee: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setRestaurant: (state, action) => {
      state.restaurantId = action.payload.id;
      state.restaurantName = action.payload.name;
    },
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(i => i.menuItemId === item.menuItemId);

      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
      } else {
        state.items.push({
          ...item,
          totalPrice: item.quantity * item.unitPrice
        });
      }

      calculateTotal(state);
    },
    updateCart: (state, action) => {
      const { menuItemId, quantity } = action.payload;
      const item = state.items.find(i => i.menuItemId === menuItemId);

      if (item) {
        if (quantity === 0) {
          state.items = state.items.filter(i => i.menuItemId !== menuItemId);
        } else {
          item.quantity = quantity;
          item.totalPrice = quantity * item.unitPrice;
        }
      }

      calculateTotal(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.menuItemId !== action.payload);
      calculateTotal(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = null;
      state.totalAmount = 0;
      state.deliveryFee = 0;
    },
    setDeliveryFee: (state, action) => {
      state.deliveryFee = action.payload;
      calculateTotal(state);
    }
  }
});

const calculateTotal = (state) => {
  state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0) + state.deliveryFee;
};

export const {
  setRestaurant,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
  setDeliveryFee
} = cartSlice.actions;

export default cartSlice.reducer;
