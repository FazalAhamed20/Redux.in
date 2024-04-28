// UserSlice.js

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  userData: null,
  error: null,
  loading: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserData(state) {
      state.loading = true;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.userData = action.payload;
    },
    fetchUserFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.userData = null;
    }
  }
});


export const {
  fetchUserData,
  fetchUserSuccess,
  fetchUserFailure,
  logoutSuccess
} = userSlice.actions;

export default userSlice.reducer;

export const fetchData = () => async (dispatch) => {
  dispatch(fetchUserData());
  try {
    const response = await axios.get('http://localhost:4000/fetchuserdata');
    
    dispatch(fetchUserSuccess(response.data));
  } catch (error) {
    dispatch(fetchUserFailure(error.message));
  }
};




