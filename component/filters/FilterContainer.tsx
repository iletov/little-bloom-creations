'use client';

import React, { useState } from 'react';
import Filters from './Filters';
import { Category } from '@/sanity.types';
import FiltersSlider from './FiltersSlider';

export interface FilterContainerProps {
  categories: Category[];
}


export const FilterContainer = ({ categories }: FilterContainerProps) => {
  return (
    <>
      <Filters categories={categories} />
      {/* <FiltersSlider categories={categories} /> */}
    </>
  );
};
