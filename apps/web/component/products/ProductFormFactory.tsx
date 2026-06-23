'use client';

import React from 'react';
import { Product } from './types';
import DiaryForm from './DiaryForm';
import BlanketForm from './forms/BlanketForm';

interface ProductFormFactoryProps {
  product: Product;
  onAddonPriceChange?: (price: number) => void;
}

const ProductFormFactory = ({ product, onAddonPriceChange }: ProductFormFactoryProps) => {
  const categorySlug = product.category?.slug?.current;

  // If the product belongs to the 'blankets' category, load the BlanketForm
  if (categorySlug === 'blankets') {
    return <BlanketForm product={product} onAddonPriceChange={onAddonPriceChange} />;
  }

  // Default fallback to the existing DiaryForm
  return <DiaryForm product={product} />;
};

export default ProductFormFactory;
