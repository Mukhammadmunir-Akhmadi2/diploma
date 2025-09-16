import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductBriefDTO } from "../types/product";

export interface WishlistState {
  products: ProductBriefDTO[];
}

const initialState: WishlistState = {
  products: [],
};
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<ProductBriefDTO>) {
      if (
        !state.products.find((p) => p.productId === action.payload.productId)
      ) {
        state.products.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.products = state.products.filter(
        (p) => p.productId !== action.payload
      );
    },
    clearWishlist(state) {
      state.products = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;