import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./features/loginSlice";
import cartSlice from "./features/cartSlice";
import { gamesApiSlice } from "./services/games";
import { genresApiSlice } from "./services/genres";

// Define the root state type
export type RootState = ReturnType<typeof store.getState>;

// Define the dispatch type
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    login: loginSlice,
    cart: cartSlice,
    [gamesApiSlice.reducerPath]: gamesApiSlice.reducer,
    [genresApiSlice.reducerPath]: genresApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(gamesApiSlice.middleware, genresApiSlice.middleware),
});
