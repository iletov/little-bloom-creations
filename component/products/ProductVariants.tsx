'use client';
import React from 'react';
import { Variant } from './ProductForm';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

type colorTagProps = {
  [key: string]: string;
};

const ProductVariants = ({ variant }: { variant: Variant }) => {
  const { variants, updateVariants } = useCart();

  console.log('# Product Variant:', variants);

  const COLOR_MAP: colorTagProps = {
    blue: 'bg-blue-500  ring-blue-500 shadow-blue-500/50',
    red: 'bg-red-500  ring-red-500 shadow-red-500/50',
    green: 'bg-green-500  ring-green-500 shadow-green-500/50',
    yellow: 'bg-yellow-500  ring-yellow-500 shadow-yellow-500/50',
    default: 'bg-[#dadad3]  ring-[#dadad3] shadow-[#dadad3]/50',
  };

  const getVariantColor = (value: Variant) => {
    if (value.id !== value.product_id) {
      return COLOR_MAP[variant.color] || COLOR_MAP.default;
    }
    return COLOR_MAP.default;
  };

  const handleChangeVariants = (value: Variant) => {
    updateVariants(value);
  };

  const colorClass = getVariantColor(variant);

  const isSelected = variants?.id === variant.id;

  return (
    <article>
      <button
        onClick={() => handleChangeVariants(variant)}
        className={cn(
          'rounded-full w-[4rem] h-[4rem] border-white ring-0 transition duration-100 ease-in-out',
          isSelected
            ? 'ring-1 ring-offset-2 shadow-lg'
            : 'opacity-70 hover:opacity-100',
          colorClass,
        )}></button>
    </article>
  );
};

export default ProductVariants;
