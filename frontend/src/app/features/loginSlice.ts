import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
import { toaster } from "../../components/ui/toaster";
import CookieService from "../../services/CookieService";

interface User {
  identifier: string;
  password: string;
}

interface LoginResponse {
  jwt: string;
  user: {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface LoginError {
  message: string;
  status?: number;
  details?: any;
}

interface LoginState {
  loading: boolean;
  data: LoginResponse | null;
  error: LoginError | null;
}

const initialState: LoginState = {
  loading: false,
  data: null,
  error: null,
};

// Thunk to login user
export const userLogin = createAsyncThunk<
  LoginResponse,
  User,
  { rejectValue: LoginError }
>("login/userLogin", async (user: User, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/local`,
      user
    );
    return response.data;
  } catch (error: any) {
    const errorPayload: LoginError = {
      message:
        error.response?.data?.error?.message ||
        "Login failed. Please try again.",
      status: error.response?.status,
      details: error.response?.data?.error?.details,
    };
    return rejectWithValue(errorPayload);
  }
});

// Thunk to fetch user data using JWT token
export const fetchUser = createAsyncThunk<
  LoginResponse,
  void,
  { rejectValue: LoginError }
>("login/fetchUser", async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const token = CookieService.get("jwt");
  if (!token) {
    return rejectWithValue({ message: "No token found" });
  }

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/users/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return { jwt: token, user: response.data };
  } catch (error: any) {
    CookieService.remove("jwt");
    const errorPayload: LoginError = {
      message:
        error.response?.data?.error?.message || "Failed to fetch user data",
      status: error.response?.status,
      details: error.response?.data?.error?.details,
    };
    return rejectWithValue(errorPayload);
  }
});

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.error = null;
      CookieService.remove("jwt");
      toaster.create({
        title: "Logged out successfully",
        type: "success",
        duration: 3000,
        closable: true,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        const date = new Date();
        date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
        const options = { path: "/", expires: date };
        CookieService.set("jwt", action.payload.jwt, options);
        toaster.create({
          title: "Logged in successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload ?? null;
        toaster.create({
          title: action.payload?.message || "Login failed",
          description: "Make sure your credentials are correct",
          type: "error",
          duration: 3000,
          closable: true,
        });
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload ?? null;
      });
  },
});

export const { logout } = loginSlice.actions;
export const selectLogin = (state: RootState) => state.login;
export default loginSlice.reducer;
