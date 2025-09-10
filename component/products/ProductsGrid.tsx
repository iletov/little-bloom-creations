'use client';
import { Category, EsotericaStore, MusicStore } from '@/sanity.types';
import React from 'react';
import { ProductThumb } from './ProductThumb';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';
import { useAppSelector } from '@/hooks/redux-hooks';
import { RootState } from '@/app/store/store';

export const ProductsGrid = ({
  products,
  bgColor,
  type,
  // favoritePdoucts,
}: {
  products: MusicStore[] | EsotericaStore[];
  bgColor?: string;
  type?: string;
  // favoritePdoucts: FavoriteProducts[];
}) => {
  const filterSelector = useAppSelector((state: RootState) => state.filter);
  console.log('filterSelector', filterSelector);

  console.log('products', products);

  const filteredProducts = filterSelector?.categories?.length
    ? products.filter(product => {
        const category = product?.category as unknown as Category[];
        return category?.some((productCategory: Category) =>
          filterSelector.categories.some(
            cat => cat?.title === productCategory?.title,
          ),
        );
      })
    : products;

  return (
    <div className=" grid grid-cols-2 md:grid-cols-5 gap-x-2 gap-y-4 md:gap-x-4">
      {filteredProducts?.map(product => {
        return (
          <React.Fragment key={product._id}>
            <AnimatePresence key={product._id}>
              <motion.div
                layout
                initial={{ opacity: 0.2, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}>
                <ProductThumb
                  key={product._id}
                  product={product}
                  bgColor={bgColor}
                  type={type}
                  // favoritePdoucts={favoritePdoucts}
                />
              </motion.div>
            </AnimatePresence>
          </React.Fragment>
        );
      })}
    </div>
  );
};
