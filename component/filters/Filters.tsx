import { Category } from '@/sanity.types';
import React from 'react';
import CheckboxContainer from '../checkbox-container/CheckboxContainer';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { RootState } from '@/app/store/store';
import {
  clearCategories,
  toggleCategory,
} from '@/app/store/features/filter/filterSlice';
import { Separator } from '../separator/Separator';

interface SelectedOptionsState {
  [key: string]: Category[];
  categories: Category[];
}

interface FilterProps {
  categories: Category[];
}

export default function Filters({ categories }: FilterProps) {
  const dispatch = useAppDispatch();
  const selectedOptions = useAppSelector((state: RootState) => state.filter);
  

  const handleFilters = (heading: string) => {
    dispatch(toggleCategory({ heading, categories }));
  };

  const mainFilters = categories.map(category => (
    <div key={category._id} className=''>
      <CheckboxContainer
        key={category._id}
        id={category._id}
        checked={selectedOptions.categories.some(
          cat => cat.title === category.title,
        )}
        onChange={
          () => handleFilters(category?.title || '')
          }
        
      >
        {category.title}
      </CheckboxContainer>
    </div>
  ));

  return (
    <div className=''>
      <div className='space-y-3'>
        {mainFilters}
      </div>
      <Separator />
      <button className="mt-4 w-full text-left text-lime-600 hover:text-lime-500 transition-colors duration-150 cursor-pointer text-[18px]" onClick={() => dispatch(clearCategories())}>
        Clear All
      </button>
    </div>
  );
}
