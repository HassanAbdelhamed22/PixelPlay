import { createSlice } from "@reduxjs/toolkit";

interface CartGame {
  // Define the properties of a game in the cart, for example:
  id: string;
  title: string;
}

const initialState = { cartGames: [] as CartGame[] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: { payload: CartGame }) => {
      state.cartGames = [...state.cartGames, action.payload];
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
