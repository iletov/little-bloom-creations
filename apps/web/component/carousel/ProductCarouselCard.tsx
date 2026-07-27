'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { getColorClass } from '../products/ColorBadge';
import { Product, Variant } from '../products/types';

export const ProductCarouselCard = ({ product, hideVariants = false }: { product: Product, hideVariants?: boolean }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  
  const baseVariant: Variant = {
    id: product.id || 'base',
    variant_name: product.name,
    price: product.price,
    color: product.color || 'default',
    images: product.images,
  };

  const hasVariants = product.variants && product.variants.length > 0;
  const allVariants = hasVariants ? [baseVariant, ...(product.variants || [])] : [baseVariant];
  
  const currentVariant = allVariants[selectedVariantIndex];
  
  const displayPrice = currentVariant?.price || product.price;
  // compareAtPrice is not part of the current schema, so we omit it
  // If we don't want to show the variant name, we can just use the main product name.

  const displayName = product.name; 
  
  let displayImage = product.images?.[0];
  if (currentVariant?.images?.[0]) {
    displayImage = currentVariant.images[0];
  }

  const href = `/categories/${product.category?.slug?.current || 'all'}/${product.slug?.current}`;

  return (
    <article className="group flex flex-col gap-4 bg-stone-50 shadow-sm rounded-[1.6rem] h-full">
      <Link href={href} className="block relative aspect-[4/5] rounded-t-[1.6rem] overflow-hidden bg-gray-50 mb-2">
         {displayImage ? (
            <Image
              src={urlFor(displayImage).url()}
              alt={displayName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
         ) : (
           <div className="w-full h-full bg-gray-100 flex items-center justify-center">
             <span className="text-gray-400">Няма снимка</span>
           </div>
         )}
      </Link>
      
      <div className="flex flex-col gap-3 px-8 py-4 flex-grow">
        <Link href={href} className="hover:text-green-dark transition-colors">
          <h3 className="font-semibold text-[2.1rem] text-green-9  line-clamp-1">{displayName}</h3>
        </Link>
        
        {/* Swatches */}
        {hasVariants && !hideVariants && (
          <div className="flex flex-wrap gap-3 items-center">
            {allVariants.map((variant, idx) => {
              const isSelected = idx === selectedVariantIndex;
              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariantIndex(idx);
                  }}
                  className={cn(
                    "w-[2.4rem] h-[2.4rem] rounded-full transition-all border border-white ring-0",
                    isSelected ? "ring-1 ring-offset-1 scale-110 shadow-md" : "opacity-80 hover:opacity-100",
                    getColorClass(variant.color)
                  )}
                  aria-label={`Select ${variant.color || 'default'}`}
                  title={variant.color || 'default'}
                />
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3 mt-auto pt-2">
          <span className="font-medium text-[1.6rem]">
            {displayPrice?.toFixed(2)} €
          </span>
        </div>
      </div>
    </article>
  );
};
