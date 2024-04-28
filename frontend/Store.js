// store.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../frontend/redux/Slice/UserSlice';
import adminReducer from '../frontend/redux/Slice/AdminSlice'

const store = configureStore({
  reducer: {
    user: userReducer,

    admin:adminReducer
  }
});

export default store;
