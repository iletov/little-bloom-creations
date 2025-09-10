import React from 'react';
import { ProductsGrid } from './ProductsGrid';
import { EsotericaStore, MusicStore } from '@/sanity.types';
import { cn } from '@/lib/utils';

export type ProductsViewProps = {
  products: MusicStore[] | EsotericaStore[];
  bgColor?: string;
  heading?: string;
  styles?: string;
  // categories: Category[];
  // favoritePdoucts: FavoriteProducts[];
};

export const ProductsView = ({
  products,
  bgColor,
  heading,
  styles,
}: ProductsViewProps) => {
  return (
    <section className="  w-full section_wrapper_sm">
      <header>
        <h2 className={cn(`heading2 text-center font-montserrat`, styles)}>
          {heading || 'Продукти...'}
        </h2>
      </header>
      <ProductsGrid products={products} bgColor={bgColor} />
    </section>
  );
};
