import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const initialState = {
  isConnected: true,
  isLoading: false,
  error: null,
};

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setIsConnected(state, action) {
      state.isConnected = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setIsConnected, setIsLoading, setError } = networkSlice.actions;
export const selectNetwork = (state: RootState) => state.network;
export default networkSlice.reducer;
