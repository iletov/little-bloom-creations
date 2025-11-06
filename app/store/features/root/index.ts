// import { MusicStore, Tag } from '@/sanity.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface CartState {
  products: any;
}

const initialState: CartState = {
  products: [],
};

export const rooteSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setAllProducts: (state, action: PayloadAction<any>) => {
      state.products = action.payload;
    },
  },
});

export const selectProductsState = (state: RootState) => state.root;
export const selectProducts = (state: RootState) => state.root.products;

export const { setAllProducts } = rooteSlice.actions;

export default rooteSlice.reducer;
