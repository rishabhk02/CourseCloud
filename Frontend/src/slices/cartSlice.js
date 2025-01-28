import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  cart: [],
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart: (state, action) => {
      console.
      state.cart = action.payload;
    },

    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item._id?.toString() != action.payload.toString());
    },

    resetCart: (state) => {
      state.cart = [];
    },
  },
})

export const { initializeCart, addToCart, removeFromCart, resetCart } = cartSlice.actions

export default cartSlice.reducer
