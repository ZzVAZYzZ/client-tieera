import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/productSlice';
import userReducer from './features/userSlice';
import orderInfoReducer from "./features/orderInfoSlice";
import orderTrackingReducer from './features/orderTrackingSlice';
import orderHistoryReducer from './features/orderHistorySlice';
import favoritesSlice  from './features/favoritesSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    user: userReducer,
    orderInfo: orderInfoReducer,
    orderTracking: orderTrackingReducer,
    orderHistory: orderHistoryReducer,
    favorites: favoritesSlice,
  },
})