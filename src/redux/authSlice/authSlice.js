import { createSlice } from '@reduxjs/toolkit';

// Check if there's a token in localStorage and if so, set the authentication state
const storedToken = localStorage.getItem('token');
const storedUserData = localStorage.getItem('userData');
let parsedUser = null;

if (storedUserData) {
  try {
    parsedUser = JSON.parse(storedUserData);
  } catch (e) {
    console.error('Error parsing user data from localStorage', e);
  }
}

const initialState = {
  token: storedToken || null,
  user: parsedUser,  // User is now safely parsed
  error: null,
  successMessage: '',
  isAuthenticated: storedToken ? true : false,  // Set isAuthenticated based on the presence of the token
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the authentication token and user data
    setAuthToken: (state, action) => {
      const { token, user } = action.payload; // Expect token and user in the payload
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);  // Store the token in localStorage
      localStorage.setItem('userData', JSON.stringify(user));  // Store the user data in localStorage
    },
    
    // Action to clear the authentication token and user data
    clearAuthToken: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');  // Remove the token from localStorage
      localStorage.removeItem('userData');  // Remove the user data from localStorage
    },

    // Action to set the error message
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Action to set the success message
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    
    // Action to clear messages (error and success)
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = '';
    },
  },
});

// Export the actions
export const { setAuthToken, clearAuthToken, setError, setSuccessMessage, clearMessages } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
