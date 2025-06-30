import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Game } from "../../types";

interface CartItem {
  id?: number; 
  documentId?: string; 
  quantity: number;
  game: Game;
}

interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.cartItems.find(
        (item) => item.game.id === action.payload.game.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ documentId: string; quantity: number }>
    ) => {
      const item = state.cartItems.find((item) => item.documentId === action.payload.documentId);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.documentId !== action.payload
      );
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, setCartItems, clearCart } = cartSlice.actions;
export const selectCart = (state: RootState) => state.cart;
export default cartSlice.reducer;
