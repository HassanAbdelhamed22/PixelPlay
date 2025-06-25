import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Game } from "../../types";

interface CartState {
  cartGames: Game[];
}

const initialState: CartState = {
  cartGames: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Game>) => {
      state.cartGames = [...state.cartGames, action.payload];
    },
  },
});

export const { addToCart } = cartSlice.actions;
export const selectCart = (state: RootState) => state.cart;
export default cartSlice.reducer;
