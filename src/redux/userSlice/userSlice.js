import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    clearUser: (state) => {
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
