// slices/projectSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projectFolder: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectFolderRequest(state) {
      state.loading = true;
      state.error = null;
    },
    setProjectFolderSuccess(state, action) {
      state.loading = false;
      state.projectFolder = action.payload;
    },
    setProjectFolderFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setProjectFolderRequest,
  setProjectFolderSuccess,
  setProjectFolderFailure,
} = projectSlice.actions;

export default projectSlice.reducer;
