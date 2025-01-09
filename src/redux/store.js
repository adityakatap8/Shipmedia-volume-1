import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice/authSlice.js';  // Import the auth slice

const store = configureStore({
  reducer: {
    auth: authReducer,  // Add auth slice to the store
  },
});

export default store;
