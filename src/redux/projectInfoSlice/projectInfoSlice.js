import { createSlice } from '@reduxjs/toolkit';

// Initial state for the slice
const initialState = {
  projectName: '',
  movieName: ''
};

// Create the slice
const projectInfoSlice = createSlice({
  name: 'projectInfo',
  initialState,
  reducers: {
    setProjectName: (state, action) => {
      state.projectName = action.payload;
    },
    setMovieName: (state, action) => {
      state.movieName = action.payload;
    }
  }
});

// Export actions to update the state
export const { setProjectName, setMovieName } = projectInfoSlice.actions;

// Export the reducer to be used in the store
export default projectInfoSlice.reducer;
