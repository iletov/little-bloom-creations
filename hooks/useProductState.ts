import { useSelector, useDispatch } from 'react-redux';
import { MusicStore, Tag } from '@/sanity.types';
import { RootState } from '@/app/store/store';
import { 
  selectProducts, 
  selectTags, 
  setAllProducts, 
  setTags  
} from '@/app/store/features/root';

export const useProductState = () => {
  const dispatch = useDispatch();

  return {
    //selectors
    allProducts: useSelector(selectProducts),
    productTags: useSelector(selectTags),

    //methods
    addProducts: (products: MusicStore[]) => dispatch(setAllProducts(products)),
    addTags: (tags: Tag[]) => dispatch(setTags(tags))
  };
};