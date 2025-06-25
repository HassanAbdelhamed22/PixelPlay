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
  loading: false, //* Pending
  data: null, //* Success => Fulfilled
  error: null, //* Error => Rejected
};

// Update the async thunk to accept the user object
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

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
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
        console.log("Cookie set:", CookieService.get("jwt"));
        toaster.create({
          title: "Logged in successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
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
      });
  },
});

export const selectLogin = (state: RootState) => state.login;
export default loginSlice.reducer;
