'use client';
import React, { useState } from 'react';
import { Product } from '@/component/products/types';
import { PortableTextContainer } from '@/component/portabletext-container/PortableTextContainer';
import { ProductCarouselCard } from '@/component/carousel/ProductCarouselCard';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export const ShopClient = ({ products, categories }: { products: Product[], categories: any[] }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // filter categories that actually have products
  const activeCategories = categories.filter(c => products.some(p => p.category?.slug?.current === c.slug?.current));

  const filteredCategories = activeFilter === 'all' 
    ? activeCategories 
    : activeCategories.filter(c => c.slug?.current === activeFilter);

  return (
    <div className="flex flex-col gap-12 font-montserrat">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4  z-20 bg-white/90 backdrop-blur-lg p-4 sm:px-6 rounded-2xl shadow-sm border border-slate-100/50">
        <span className="text-slate-400 font-medium mr-2 text-[1.2rem] sm:text-[1.4rem] uppercase tracking-wider hidden sm:block">Филтър</span>
        <button
          onClick={() => {
            setActiveFilter('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={cn(
            "px-4 sm:px-6 py-2 rounded-full text-[1.3rem] sm:text-[1.4rem] font-semibold transition-all duration-300",
            activeFilter === 'all' 
              ? "bg-green-dark text-white shadow-md shadow-green-dark/20 scale-105" 
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          Всички
        </button>
        {activeCategories.map(category => (
          <button
            key={category.slug?.current}
            onClick={() => {
              setActiveFilter(category.slug?.current);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={cn(
               "px-4 sm:px-6 py-2 rounded-full text-[1.3rem] sm:text-[1.4rem] font-semibold transition-all duration-300",
               activeFilter === category.slug?.current
                 ? "bg-green-dark text-white shadow-md shadow-green-dark/20 scale-105" 
                 : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Grouped Products */}
      <div className="flex flex-col gap-16 sm:gap-24">
        <AnimatePresence mode="popLayout">
          {filteredCategories.map((category) => {
            const categoryProducts = products.filter(p => p.category?.slug?.current === category.slug?.current);
            if (categoryProducts.length === 0) return null;

            return (
              <motion.div 
                key={category.slug?.current}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col gap-8 sm:gap-10"
              >
                <div className="flex flex-col gap-4">
                  <h2 className="text-[2.4rem] sm:text-[3.2rem] font-bold text-green-dark tracking-tight">{category.name}</h2>
                  {category.description && (
                    <div className="text-slate-600 text-[1.4rem] sm:text-[1.6rem] max-w-4xl leading-relaxed">
                      <PortableTextContainer data={category.description} />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {categoryProducts.map((product) => (
                    <div key={product.slug?.current} className="w-full">
                       <ProductCarouselCard product={product} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
