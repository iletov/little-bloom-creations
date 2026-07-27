'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { urlFor } from '@/sanity/lib/image';
import { ProductCarouselCard } from '../carousel/ProductCarouselCard';
import { ArrowRight } from 'lucide-react';
import { Product } from '../products/types';

type DropDownProps = {
  data: {
    label: string;
    href: string;
    items?: {
      label: string;
      href: string;
      desc?: any;
      image?: any;
    }[];
    products?: Product[];
  };
  openDropdown: number | null;
  index: number;
};

const Dropdown = ({ data, openDropdown, index }: DropDownProps) => {
  const isMegaMenu = data?.products && data.products.length > 0;
  
  // Set default active category to the first one
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  useEffect(() => {
    if (data?.items && data.items.length > 0 && !activeCategory) {
      setActiveCategory(data.items[0].href);
    }
  }, [data?.items, activeCategory]);

  const activeCategoryData = data?.items?.find(c => c.href === activeCategory) || data?.items?.[0];
  const activeProducts = data?.products?.filter((p: any) => p.category?.slug?.current === activeCategory) || [];

  return (
    <AnimatePresence>
      {data?.items && openDropdown === index && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            isMegaMenu 
              ? "fixed left-0 top-[5.6rem] w-[100vw] z-[40]" 
              : "absolute top-[calc(100%+10px)] left-0 min-w-[200px] z-50"
          )}>
          <div className={cn(
            "bg-white border-slate-200/60 shadow-2xl overflow-hidden",
            isMegaMenu ? "rounded-b-[2rem] rounded-t-none border-t border-t-slate-100" : "rounded-2xl border bg-white/95 backdrop-blur-xl"
          )}>
            {isMegaMenu ? (
              <div className="section_wrapper flex min-h-[360px]">
                {/* Left Column: Categories */}
                <div className="w-[15%] p-8 lg:py-8 lg:px-12 border-r border-slate-100 bg-white">
                  <h3 className="text-[1.3rem] font-bold text-gray-400 uppercase tracking-wider mb-5 px-4">
                    Категории
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {data.items.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={`/${data.href}/${subItem.href}`}
                          onMouseEnter={() => setActiveCategory(subItem.href)}
                          className={cn(
                            "block px-4 py-3 rounded-xl transition-all duration-100",
                            activeCategory === subItem.href
                              ? "bg-slate-50 text-white font-semibold shadow-sm bg-green-5"
                              : "text-slate-600 hover:text-green-dark hover:bg-slate-50 font-medium"
                          )}
                        >
                          <span className="text-[1.5rem] capitalize">{subItem.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Column: Products */}
                <div className="flex-1 p-8 lg:py-8 lg:px-12 bg-white">
                  <div className="mb-6">
                    <h3 className="text-[2.4rem] font-bold text-green-dark capitalize mb-1">
                      {activeCategoryData?.label}
                    </h3>
                    <p className="text-[1.4rem] text-slate-500 line-clamp-1">
                      Разгледайте всички продукти от тази категория
                    </p>
                  </div>
                  
                  <div className="flex items-stretch overflow-x-auto snap-x snap-mandatory gap-6 pb-4 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-slate-200/80 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                    {activeProducts.map((product: any, pIndex: number) => (
                      <div key={pIndex} className="w-[calc(25%-18px)] shrink-0 snap-start flex flex-col min-h-[320px]">
                        <ProductCarouselCard product={product} hideVariants={true} />
                      </div>
                    ))}
                    
                    {/* View All Card */}
                    <Link 
                      href={`/${data.href}/${activeCategory}`}
                      className="group relative w-[calc(25%-18px)] shrink-0 snap-start flex flex-col overflow-hidden rounded-[2rem] shadow-md transition-all duration-300 min-h-[320px]"
                    >
                      {activeCategoryData?.image ? (
                        <Image
                          src={urlFor(activeCategoryData.image).url()}
                          alt={activeCategoryData.label}
                          fill
                          sizes="25vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-100" />
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500 z-0" />
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col items-start text-white pointer-events-none">
                        <h3 className="font-medium text-[2.2rem] tracking-wide mb-2 drop-shadow-md capitalize">
                          {activeCategoryData?.label}
                        </h3>
                        
                        {/* Pill Button */}
                        <div className="mt-2 bg-white text-black px-6 py-2.5 rounded-full text-[1.3rem] font-semibold flex items-center justify-center transform transition-all duration-300 shadow-sm gap-2">
                          Разгледай
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* Original Dropdown Fallback */
              <ul className="py-3 block min-w-max">
                {data?.items &&
                  data.items.length > 0 &&
                  data.items.map((subItem, subIndex: number) => (
                    <li key={subIndex} className="px-2">
                      <Link
                        href={`/${data?.href}/${subItem?.href}`}
                        className="group px-4 py-3 flex items-start gap-4 justify-baseline hover:bg-slate-50/80 transition-all duration-300 rounded-xl cursor-pointer">
                        <div className="relative min-w-[4.5rem] h-auto aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50/50 shadow-sm flex items-center justify-center  group-hover:shadow-md transition-all duration-300">
                          <Image
                            src={subItem?.image ? urlFor(subItem.image).width(200).height(200).fit('crop').url() : "/placeholder.svg"}
                            alt={subItem?.label || "Category Image"}
                            fill={true}
                            sizes="200px"
                            quality={100}
                            className={cn("object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300", !subItem?.image && "p-2")}
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-800 block text-[1.5rem] font-semibold capitalize group-hover:text-emerald-700 transition-colors duration-300">
                            {subItem?.label}
                          </p>
                          <PortableTextContainer
                            data={subItem?.desc}
                            className="text-[1.3rem] font-medium text-slate-500 leading-snug line-clamp-2"
                          />
                        </div>
                      </Link>
                      <div
                        className={cn(
                          'w-[90%] mx-auto h-[1px] bg-slate-100 my-2',
                          subIndex === (data?.items?.length ?? 0) - 1 && 'hidden',
                        )}
                      />
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dropdown;
