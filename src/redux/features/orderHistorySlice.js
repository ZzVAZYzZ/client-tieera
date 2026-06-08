// redux/features/orderHistorySlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { refresh } from './userSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const initialState = {
    orders: [],
    status: "idle",
    error: null,
}

// Hàm gọi API lấy danh sách đơn hàng
const fetchOrdersApi = async (userId, token) => {
    const response = await axios.get(`${API_URL}/api/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
    return response.data;
};


// -------------------------------------------------------------------
// THUNK: Lấy lịch sử đơn hàng theo User ID
// -------------------------------------------------------------------
export const fetchOrdersByUser = createAsyncThunk(
    'orderHistory/fetchOrdersByUser',
    // Thêm thunkAPI để truy cập dispatch
    async (userId, { rejectWithValue, dispatch }) => {
        let token = localStorage.getItem('access_token');

        try {
            // Lần gọi API đầu tiên
            return await fetchOrdersApi(userId, token);
        } catch (error) {

            const status = error.response?.status;

            // ❌ KIỂM TRA LỖI 401 (Token hết hạn)
            if (status === 401) {
                console.warn("Token hết hạn khi tải lịch sử đơn hàng. Đang cố gắng refresh...");

                // 1. GỌI REFRESH TOKEN
                const refreshAction = await dispatch(refresh());

                if (refresh.fulfilled.match(refreshAction)) {
                    // 2. REFRESH THÀNH CÔNG -> Lấy token mới
                    token = localStorage.getItem('access_token');

                    try {
                        // 3. THỬ GỌI LẠI API VỚI TOKEN MỚI
                        return await fetchOrdersApi(userId, token);
                    } catch (retryError) {
                        // Lỗi lần 2 (Ngay cả sau khi refresh)
                        const message = retryError.response?.data?.message || 'Refresh thành công nhưng gọi lại API thất bại.';
                        return rejectWithValue(message);
                    }

                } else {
                    // Refresh thất bại (Refresh Token hết hạn)
                    console.error("Refresh token thất bại. Yêu cầu đăng nhập lại.");
                    const message = refreshAction.payload || 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.';
                    return rejectWithValue(message);
                }
            }

            // Xử lý các lỗi khác ngoài 401
            const message = error.response?.data?.message || error.message || 'Failed to fetch order history';
            return rejectWithValue(message);
        }
    }
)

// -------------------------------------------------------------------
// SLICE (Giữ nguyên)
// -------------------------------------------------------------------
export const orderHistorySlice = createSlice({
    name: 'orderHistory',
    initialState,
    reducers: {
        resetOrderHistoryState: (state) => {
            state.orders = []
            state.status = "idle"
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrdersByUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.orders = action.payload;
            })
            .addCase(fetchOrdersByUser.rejected, (state, action) => {
                state.status = "failed";
                state.orders = [];
                state.error = action.payload || action.error.message;
            })
    },
})

export const { resetOrderHistoryState } = orderHistorySlice.actions
export default orderHistorySlice.reducer