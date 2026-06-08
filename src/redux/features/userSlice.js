import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const initialState = {
  users:[],
  user: null,
  status: "idle",
  error: "",
  message: "",
  authError: "",
  updateProfileStatus: "idle",
  uploadAvatarStatus: "idle",
};

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      const response = await axios.get(
        `${API_URL}/api/users/getAllUsers`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Fetch users failed";
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      // Lưu token vào localStorage
      localStorage.setItem("access_token", response.data.accessToken);

      return response.data.user;
    } catch (error) {
      // Lấy message từ server (nếu có)
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// export const loginByGoogle = createAsyncThunk(
//   'user/loginByGoogle',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('http://localhost:8000/api/users/google/callback',{
//         withCredentials: true,
//       })

//       localStorage.setItem('access_token', response.data.accessToken)

//       return response.data.user
//     } catch (error) {

//       const message =
//         error.response?.data?.message || error.message || 'Login failed'
//       return rejectWithValue(message)
//     }
//   }
// )

export const register = createAsyncThunk(
  "user/register",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, {
        email,
        password,
      });
      return response.data.message;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Register failed";

      return rejectWithValue(message);
    }
  }
);

export const refresh = createAsyncThunk(
  "user/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem("access_token", response.data.accessToken);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Refresh failed";
      return rejectWithValue(message);
    }
  }
);

export const current = createAsyncThunk(
  "user/current",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${API_URL}/api/users/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Get current failed"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ name, email, phone, address }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.put(
        `${API_URL}/api/users/profile`,
        { name, email, phone, address },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Update profile failed";
      return rejectWithValue(message);
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "user/uploadAvatar",
  async (file, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.post(
        `${API_URL}/api/users/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Upload avatar failed";
      return rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = "";
      state.message = "";
      state.updateProfileStatus = "idle";
      state.uploadAvatarStatus = "idle";
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "successed";
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(login.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "successed";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(register.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "successed";
        state.message = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // .addCase(loginByGoogle.pending, (state) => {
      //   state.status = 'loading'
      // })
      // .addCase(loginByGoogle.fulfilled, (state, action) => {
      //   state.status = 'succeeded'
      //   state.user = action.payload
      // })
      // .addCase(loginByGoogle.rejected, (state, action) => {
      //   state.status = 'failed'
      //   state.error = action.payload || action.error.message;
      // })
      .addCase(refresh.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refresh.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(refresh.rejected, (state, action) => {
        state.status = "failed";
        state.authError = action.payload || action.error.message;
      })
      .addCase(current.pending, (state) => {
        state.status = "loading";
      })
      .addCase(current.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(current.rejected, (state, action) => {
        state.status = "failed";
        state.authError = action.payload || action.error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateProfileStatus = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfileStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfileStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(uploadAvatar.pending, (state) => {
        state.uploadAvatarStatus = "loading";
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.uploadAvatarStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.uploadAvatarStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetUserState, updateUser } = userSlice.actions;
export default userSlice.reducer;
