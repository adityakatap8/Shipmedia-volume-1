import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Get token and user data from cookies
const storedToken = Cookies.get('token');
const storedUserData = Cookies.get('userData');
let parsedUser = null;

if (storedUserData) {
  try {
    parsedUser = JSON.parse(storedUserData);
  } catch (e) {
    console.error('Error parsing user data from cookies', e);
  }
}

const initialState = {
  token: storedToken || null,
  user: parsedUser,
  error: null,
  successMessage: '',
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set token and user info in cookies
    setAuthToken: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;

      Cookies.set('token', token, { expires: 1 }); // Expires in 1 day
      Cookies.set('userData', JSON.stringify(user), { expires: 1 });
    },

    // Clear token and user info from cookies
    clearAuthToken: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      Cookies.remove('token');
      Cookies.remove('userData');
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },

    clearMessages: (state) => {
      state.error = null;
      state.successMessage = '';
    },
  },
});

export const {
  setAuthToken,
  clearAuthToken,
  setError,
  setSuccessMessage,
  clearMessages,
} = authSlice.actions;

export default authSlice.reducer;
