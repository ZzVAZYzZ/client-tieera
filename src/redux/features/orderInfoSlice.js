import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const STORAGE_KEY = "order_info";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const initialState = {
  orderInfo: {
    order_id: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    payment: "COD",
    cartTotal: 0,
    cart: { items: [] },
  },
  orderAll: [],
  status: "idle", // loading | succeeded | failed
  error: "",
  message: "",
};

//
// ============ ASYNC THUNKS ============
//

// ✅ Khởi tạo từ localStorage
export const initFromLocal = createAsyncThunk(
  "order/initFromLocal",
  async (_, { rejectWithValue }) => {
    if (typeof window === "undefined") return initialState.orderInfo;
    try {
      // Đọc order_info nếu có
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(raw || "null") || {};

      // Đọc cart_items riêng biệt
      const rawCart = localStorage.getItem("cart_items");
      const cartList = rawCart ? JSON.parse(rawCart) : [];

      // Tạo bản kết hợp an toàn
      const merged = {
        ...initialState.orderInfo,
        ...parsed,
        cart: {
          items: Array.isArray(cartList) ? cartList : [],
        },
      };

      return merged;
    } catch (err) {
      return rejectWithValue("Không thể đọc dữ liệu đơn hàng từ localStorage.");
    }
  }
);


// ✅ Lưu thông tin đơn hàng vào localStorage
export const saveToLocal = createAsyncThunk(
  "order/saveToLocal",
  async (data, { rejectWithValue }) => {
    if (typeof window === "undefined") return data;
    try {
      const payload =
        data && typeof data === "object"
          ? { ...initialState.orderInfo, ...data }
          : { ...initialState.orderInfo };

      // Nếu chưa có giỏ hàng → lấy từ cart_items
      if (!payload.cart || typeof payload.cart !== "object")
        payload.cart = { items: [] };
      if (
        !Array.isArray(payload.cart.items) ||
        payload.cart.items.length === 0
      ) {
        try {
          const rawCart = localStorage.getItem("cart_items");
          const cartList = rawCart ? JSON.parse(rawCart) : [];
          if (Array.isArray(cartList)) payload.cart.items = cartList;
        } catch {}
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return payload;
    } catch (err) {
      return rejectWithValue("Lỗi khi lưu thông tin đơn hàng.");
    }
  }
);

// ✅ Gọi API tạo đơn hàng thật (POST /api/orders/makeOrder)
export const makeOrder = createAsyncThunk(
  "order/makeOrder",
  async (_, { getState, rejectWithValue }) => {
    const root = getState();
    const orderInfo = root.orderInfo?.orderInfo || {};
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    try {
      const rawCart = localStorage.getItem("cart_items");
      const list = rawCart ? JSON.parse(rawCart) : [];
      const selected = Array.isArray(list)
        ? list.filter((it) => it.selected)
        : [];

      if (selected.length === 0) {
        return rejectWithValue(
          "Vui lòng chọn ít nhất 1 sản phẩm trong giỏ hàng."
        );
      }

      const orderDetails = selected.map((it) => ({
        product_id: it.product_id,
        product_name: it.product_name || it.name || "",
        quantity: Math.max(1, Number(it.quantity) || 1),
        unit_price: Number(it.unit_price ?? it.price ?? 0) || 0,
        discount: Math.max(
          0,
          Number(it.discount ?? it.discount_price ?? 0) || 0
        ),
      }));

      const total_amount = orderDetails.reduce((sum, d) => {
        const price = Math.max(
          0,
          (Number(d.unit_price) || 0) - (Number(d.discount) || 0)
        );
        return sum + price * d.quantity;
      }, 0);

      const resp = await axios.post(
        `${API_URL}/api/orders/makeOrder`,
        {
          shipping_address: String(orderInfo.address || "").trim(),
          total_amount,
          orderDetails,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (resp.status >= 200 && resp.status < 300) {
        localStorage.setItem("cart_items", JSON.stringify([]));
        return resp.data;
      }
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Đặt hàng thất bại."
      );
    }
  }
);

export const fetchOrdersByStatus = createAsyncThunk(
  "orders/fetchOrdersByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      if (!token) {
        // Token không tồn tại
        return rejectWithValue("Bạn chưa đăng nhập hoặc token không hợp lệ.");
      }

      const response = await axios.get(
        `${API_URL}/api/orders/status/${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Kiểm tra status code
      if (response.status < 200 || response.status >= 300) {
        return rejectWithValue(`API trả về lỗi: ${response.status}`);
      }
      console.log(response);

      return response.data;
    } catch (err) {
      // Log chi tiết để debug
      console.error(
        "fetchOrdersByStatus error:",
        err.response?.status,
        err.response?.data
      );

      return rejectWithValue(
        err?.response?.data?.message ||
          `Không thể lấy danh sách đơn hàng. (${
            err?.response?.status || "unknown"
          })`
      );
    }
  }
);

// --- Thunk: Cập nhật trạng thái đơn hàng ---
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, newStatus }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");

      const res = await axios.patch(
        `${API_URL}/api/orders/${orderId}`,
        { newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      return res.data.order; // trả về đơn hàng đã cập nhật
    } catch (err) {
      console.error(
        "updateOrderStatus error:",
        err?.response?.data || err.message
      );
      return rejectWithValue(
        err?.response?.data?.message || "Cập nhật trạng thái thất bại."
      );
    }
  }
);
//
// ============ SLICE ============
//
export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setField: (state, action) => {
      const { key, value } = action.payload;
      if (key in state.orderInfo) state.orderInfo[key] = value;
    },
    setAll: (state, action) => {
      state.orderInfo = { ...initialState.orderInfo, ...action.payload };
    },
    clearOrder: (state) => {
      state.orderInfo = { ...initialState.orderInfo };
      state.status = "idle";
      state.error = "";
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // --- initFromLocal ---
      .addCase(initFromLocal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initFromLocal.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderInfo = action.payload;
      })
      .addCase(initFromLocal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // --- saveToLocal ---
      .addCase(saveToLocal.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderInfo = action.payload;
      })
      .addCase(saveToLocal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // --- makeOrder ---
      .addCase(makeOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload?.message || "Đặt hàng thành công!";
      })
      .addCase(makeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // --- fetchOrdersByStatus ---

      .addCase(fetchOrdersByStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderAll = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // --- updateOrderStatus ---
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = "";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Cập nhật đơn hàng trong orderAll nếu tồn tại
        const updatedOrder = action.payload;
        const index = state.orderAll.findIndex(
          (o) => o._id === updatedOrder._id
        );
        if (index !== -1) {
          state.orderAll[index] = updatedOrder;
        }
        // Nếu muốn, cũng có thể cập nhật orderInfo nếu đang hiển thị đơn này
        if (state.orderInfo._id === updatedOrder._id) {
          state.orderInfo = { ...state.orderInfo, ...updatedOrder };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
      
  },
});

//
// ============ SELECTORS ============
//
export const { setField, setAll, clearOrder } = orderSlice.actions;
export const selectOrderInfo = (state) => state.orderInfo.orderInfo;
export const selectCartItems = (state) => state.orderInfo.orderInfo.cart.items;
export const selectCartTotal = (state) => {
  const items = state.orderInfo.orderInfo.cart.items || [];
  return items.reduce((sum, it) => {
    const unit = Number(it.unit_price || 0);
    const discount = Math.max(0, Number(it.discount || 0));
    const price = Math.max(0, unit - discount);
    const qty = Math.max(1, Number(it.quantity || 1));
    return sum + price * qty;
  }, 0);
};

export default orderSlice.reducer;
