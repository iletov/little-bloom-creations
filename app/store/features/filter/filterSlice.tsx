// import { Category } from '@/sanity.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedOptionsState {
  [key: string]: any;
  categories: any;
}

interface FilterProps {
  heading: string;
  categories: any;
}

const initialState: SelectedOptionsState = {
  categories: [],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    // toggleCategory: (state, action: PayloadAction<FilterProps>) => {
    //   const { heading, categories } = action.payload;
    //   const isSelected = state.categories.some(
    //     category => category.title === heading,
    //   );

    //   if (isSelected) {
    //     state.categories = state.categories.filter(
    //       category => category.title !== heading,
    //     );
    //   } else {
    //     state.categories.push(
    //       ...categories.filter(category => category.title === heading),
    //     );
    //   }
    // },
    clearCategories: state => {
      state.categories = [];
    },
  },
});

export const { clearCategories } = filterSlice.actions;
export default filterSlice.reducer;
