import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const initialState = {
  orderTrackingData: null,
  status: "idle",
  error: "",
  message: "",
  authError: "",
}

export const lookupOrder = createAsyncThunk(
  'order/lookup',
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }, {
        withCredentials: true,
      })
      return response.data
    } catch (error) {
      // Lấy message từ server (nếu có)
      const message =
        error.response?.data?.message || error.message || 'Login failed'
      return rejectWithValue(message)
    }

  }
)


export const orderTrackingSlice = createSlice({
  name: 'orderTracking',
  initialState,
  reducers: {
    resetOrderTrackingState: (state) => {
      state.orderTrackingData = null
      state.status = "idle"
      state.error = ""
      state.message = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(lookupOrder.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(lookupOrder.fulfilled, (state, action) => {
        state.status = "successed";
        state.orderTrackingData = action.payload;
      })
      .addCase(lookupOrder.rejected, (state, action) => {
        state.status = "failed";
        state.orderTrackingData = null;
        state.error = action.payload || action.error.message;
      })
  },

})

export const { resetOrderTrackingState } = orderTrackingSlice.actions
export default orderTrackingSlice.reducer