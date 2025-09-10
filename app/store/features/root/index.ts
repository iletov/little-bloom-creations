import { MusicStore, Tag } from '@/sanity.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface CartState {
  products: MusicStore[];
  tags: Tag[];
}

const initialState: CartState = {
  products: [],
  tags: [],
};

export const rooteSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setAllProducts: (state, action: PayloadAction<MusicStore[]>) => {
      state.products = action.payload;
    },

    setTags: (state, action: PayloadAction<Tag[]>) => {
      state.tags = action.payload;
    },
  },
});

export const selectProductsState = (state: RootState) => state.root;
export const selectProducts = (state: RootState) => state.root.products;
export const selectTags = (state: RootState) => state.root.tags;

export const { setAllProducts, setTags } = rooteSlice.actions;

export default rooteSlice.reducer;
