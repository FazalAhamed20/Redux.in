// AdminSlice.js

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  adminData: [],
  error: '',
  loading: false
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    fetchAdminRequest(state) {
      state.loading = true;
    },
    fetchAdminSuccess(state, action) {
      state.loading = false;
      state.adminData = action.payload;
    },
    fetchAdminFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.adminData = null;
    }
  }
});

export const {
  fetchAdminRequest,
  fetchAdminSuccess,
  fetchAdminFailure,
  logoutSuccess
} = adminSlice.actions;

export default adminSlice.reducer;

const fetchAdminDataMemoized = async () => {
  try {
    const response = await axios.get('http://localhost:4000/fetchallusers');
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchAdminData = () => async (dispatch) => {
  dispatch(fetchAdminRequest());
  try {
    const data = await fetchAdminDataMemoized();
    console.log("data",data);
    dispatch(fetchAdminSuccess(data));
  } catch (error) {
    dispatch(fetchAdminFailure(error.message));
  }
};


