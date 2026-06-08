import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const initialState = {
  favorites: [],      // danh sách sản phẩm yêu thích
  status: "idle",
  error: "",
};

// 🧡 1) Thêm sản phẩm vào favorite
export const favoriteProduct = createAsyncThunk(
  "favorites/favoriteProduct",
  async ({ productId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/favorites/favoriteProduct/`,
        { product_id: productId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // BE trả { message, favorite }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Favorite product failed"
      );
    }
  }
);

// 💔 2) Bỏ yêu thích 1 sản phẩm
export const unFavoriteProduct = createAsyncThunk(
  "favorites/unFavoriteProduct",
  async ({ productId, token }, { rejectWithValue }) => {
    try {
      // LƯU Ý: axios.delete muốn gửi body thì phải dùng { data: {...} }
      const response = await axios.delete(
        `${API_URL}/api/favorites/unFavoriteProduct/`,
        {
          data: { product_id: productId },
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // tự gắn thêm productId để reducer biết xóa cái nào
      return { ...response.data, productId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unfavorite product failed"
      );
    }
  }
);

// 📜 3) Lấy danh sách favorite của user
export const getUserFavorites = createAsyncThunk(
  "favorites/getUserFavorites",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/favorites/getUserFavorites/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // BE đang trả: { message, count, favorites }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch favorites failed"
      );
    }
  }
);

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    resetFavoritesStatus: (state) => {
      state.status = "idle";
      state.error = "";
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== getUserFavorites =====
      .addCase(getUserFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        // backend: { message, count, favorites }
        state.favorites = action.payload.favorites || [];
      })
      .addCase(getUserFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // ===== favoriteProduct =====
      .addCase(favoriteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(favoriteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";

        const favorite = action.payload.favorite || action.payload;

        if (!favorite) return;

        // tránh thêm trùng product_id
        const exists = state.favorites.some(
          (item) => item.product_id === favorite.product_id
        );

        if (!exists) {
          state.favorites.push(favorite);
        }
      })
      .addCase(favoriteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // ===== unFavoriteProduct =====
      .addCase(unFavoriteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(unFavoriteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";

        const deletedId = action.payload.productId;
        if (deletedId) {
          state.favorites = state.favorites.filter(
            (f) => f.product_id !== deletedId
          );
        }
      })
      .addCase(unFavoriteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default favoritesSlice.reducer;
export const { resetFavoritesStatus, clearFavorites } = favoritesSlice.actions;
