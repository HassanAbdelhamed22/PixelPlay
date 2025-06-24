import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./features/loginSlice";

// Define the root state type
export type RootState = ReturnType<typeof store.getState>;

// Define the dispatch type
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
  },
});
