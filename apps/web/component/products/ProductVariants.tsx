'use client';
import React from 'react';
import { Variant } from './types';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

import { getColorClass } from './ColorBadge';

const ProductVariants = ({ variant }: { variant: Variant }) => {
  const { variants, updateVariants } = useCart();

  const handleChangeVariants = (value: Variant) => {
    updateVariants(value);
  };

  const colorClass = getColorClass(variant.color);
  const variantIdentifier = variant.id || variant.sku || variant.variant_sku;
  const selectedVariantIdentifier = variants?.id || variants?.sku || variants?.variant_sku;

  const isSelected = selectedVariantIdentifier === variantIdentifier;

  // console.log('ProductVariant render:', { variantId: variantIdentifier, colorClass, isSelected, reduxVariants: variants });

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
