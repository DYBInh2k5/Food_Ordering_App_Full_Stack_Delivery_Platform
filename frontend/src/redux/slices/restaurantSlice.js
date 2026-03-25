import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurants: [],
  currentRestaurant: null,
  menu: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    page: 1,
    limit: 10
  }
};

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRestaurants: (state, action) => {
      state.restaurants = action.payload.restaurants;
      state.filters.page = action.payload.page || 1;
      state.loading = false;
      state.error = null;
    },
    setCurrentRestaurant: (state, action) => {
      state.currentRestaurant = action.payload;
      state.error = null;
    },
    setMenu: (state, action) => {
      state.menu = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
      state.menu = [];
    }
  }
});

export const {
  setLoading,
  setRestaurants,
  setCurrentRestaurant,
  setMenu,
  setSearchQuery,
  setPage,
  setError,
  clearError,
  clearCurrentRestaurant
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
