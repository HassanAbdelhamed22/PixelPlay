import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./features/loginSlice";
import cartSlice from "./features/cartSlice";
import { apiSlice } from "./services/apiSlice";

// Define the root state type
export type RootState = ReturnType<typeof store.getState>;

// Define the dispatch type
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    login: loginSlice,
    cart: cartSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable data
    }).concat(apiSlice.middleware),
});
