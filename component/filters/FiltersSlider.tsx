'use client';

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
import CheckboxButton from '../checkbox-container/CheckboxButton';
import { X } from 'lucide-react';

interface SelectedOptionsState {
  [key: string]: Category[];
  categories: Category[];
}

interface FilterProps {
  categories: Category[];
}

export default function FiltersSlider({ categories }: FilterProps) {
  const dispatch = useAppDispatch();
  const selectedOptions = useAppSelector((state: RootState) => state.filter);

  const handleFilters = (heading: string) => {
    dispatch(toggleCategory({ heading, categories }));
  };

  const mainFilters = categories.map(category => (
    <div key={category._id} className="">
      <CheckboxButton
        key={category._id}
        id={category._id}
        checked={selectedOptions.categories.some(
          cat => cat.title === category.title,
        )}
        onChange={() => handleFilters(category?.title || '')}
        className="rounded-[5px] bg-neutral-950/15">
        {category.title}
      </CheckboxButton>
    </div>
  ));

  return (
    <div className="flex flex-col [&>button]:items-center gap-2 md:flex-row items-center md:justify-between w-full ">
      <div className="flex gap-1 md:gap-4 overflow-x-scroll md:overflow-hidden w-full">
        {mainFilters}
      </div>
      {/* <button
        className="flex gap-2 min-w-[10%] transition-colors duration-150 cursor-pointer text-[0.875rem] px-3 py-2 w-fit "
        onClick={() => dispatch(clearCategories())}>
        <span>Изчисти</span>
        <X className="h-4 w-4" />
      </button> */}
    </div>
  );
}
