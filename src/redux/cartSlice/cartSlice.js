import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movies: [], // Array to store movies in the cart
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartMovies: (state, action) => {
      state.movies = action.payload; // Set the movies in the cart
    },
    addMovieToCart: (state, action) => {
      state.movies.push(action.payload); // Add a movie to the cart
    },
    clearCart: (state) => {
      state.movies = []; // Clear all movies from the cart
    },
  },
});

export const { setCartMovies, addMovieToCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;