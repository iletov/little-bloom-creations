import { Category } from '@/sanity.types';
import React from 'react';
import FiltersSlider from './FiltersSlider';
import { getCategoriesByTag } from '@/sanity/lib/categories/getCategoriesByTag';

interface FilterWrapperProps {
  tag: string;
}

export const FiltersSliderWrapper = async ({ tag }: FilterWrapperProps) => {
  const categories = await getCategoriesByTag(tag);

  return (
    <section className="section_wrapper_sm w-full flex gap-4">
      <FiltersSlider categories={categories} />
    </section>
  );
};
