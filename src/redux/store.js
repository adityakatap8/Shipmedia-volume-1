import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice/authSlice.js';  
import projectReducer from './projectSlice/projectSlice.js';
import userSlice from './userSlice/userSlice.js';
import projectInfoSlice from './projectInfoSlice/projectInfoSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer, 
    project: projectReducer,
    user: userSlice,
    projectinfo: projectInfoSlice,  // Ensure this matches the slice name in your dispatches
  },
});

export default store;
