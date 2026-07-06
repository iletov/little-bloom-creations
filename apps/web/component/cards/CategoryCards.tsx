import { urlFor } from '@/sanity/lib/image';
import { descriptionType, ImagesType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import HighlightedHeading from '../heading-description/HighlightedHeading';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import FloralDivider from '../heading-description/FloralDivider';
import { Button } from '@/components/ui/button';
import { GradientOverlay } from '@/components/ui/gradient-overlay';

interface CategoryCardsProps {
  data: {
    heading?: {
      title: string;
      highlightedWord?: string;
      highlightedColor?: string;
    };
    title?: string;
    description?: descriptionType;
    backgroundImages?: ImagesType[];
    categories?: Array<{
      _id: string;
      name: string;
      slug?: { current: string };
      image?: ImagesType;
    }>;
    button?: {
      text: string;
      slug?: { current: string };
    };
  };
}

const CategoryCards = ({ data }: CategoryCardsProps) => {
  const getSlugLink = (slugStr: string): string => {
    if (!slugStr) return '';
    if (slugStr.startsWith('http') || slugStr.startsWith('/')) return slugStr;
    return `/categories/${slugStr}`;
  };

  const items =
    data?.categories && data.categories.length > 0
      ? data.categories.map(cat => ({
          title: cat.name,
          slug: cat.slug?.current || '',
          image: cat.image,
          alt: cat.name,
        }))
      : data?.backgroundImages?.map(img => ({
          title: img.title || '',
          slug: img.slug?.current || '',
          image: img,
          alt: img.alt || '',
        })) || [];

  if (items.length === 0 && !data.heading?.title && !data.title) {
    return null;
  }

  return (
    <section className="bg-green-0/40 border-y border-green-5/10 py-16 sm:py-20 lg:py-24 min-h-[85vh] flex flex-col justify-center">
      <div className="section_wrapper">
        {/* Section Header */}
        {(data.heading?.title || data.title) && (
          <header className="mx-auto mb-12 max-w-[84rem] text-center lg:mb-16 space-y-4">
            {data.heading?.title ? (
              <HighlightedHeading
                text={data.heading.title}
                word={data.heading.highlightedWord}
                color={data.heading.highlightedColor ?? 'var(--green-5)'}
                className="mx-auto max-w-[120rem] text-[3.6rem] sm:text-[4.6rem] lg:text-[5.6rem] font-semibold text-green-dark leading-[1.1]"
                tag="h2"
              />
            ) : (
              <h2 className="text-[3.6rem] font-semibold leading-[1.1] text-green-dark sm:text-[4.6rem] lg:text-[5.6rem]">
                {data.title}
              </h2>
            )}

            <div className="grid place-items-center gap-5 mt-4">
              {data.description && (
                <PortableTextContainer
                  data={data.description}
                  className="mx-auto max-w-[76rem] text-[1.6rem] leading-[1.6] text-slate-600 sm:text-[1.8rem]"
                />
              )}
              <div className="grid place-items-center">
                <FloralDivider />
              </div>
            </div>
          </header>
        )}

        {/* Grid of Categories */}
        {items.length > 0 && (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-6 px-6 sm:-mx-8 sm:px-8 sm:gap-6 md:grid md:grid-cols-2 xl:grid-cols-4 md:gap-6 lg:gap-8 md:overflow-visible md:snap-none md:pb-0 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {items.map(item => (
              <Link
                href={getSlugLink(item.slug)}
                key={`${item.slug}-${item.title}`}
                className="flex-none w-[75vw] sm:w-[50vw] md:w-auto snap-center aspect-[3/4.5] sm:aspect-[6/9.5] relative overflow-hidden rounded-[2rem] group block shadow-md"
              >
                <Image
                  src={
                    item.image
                      ? urlFor(item.image).url()
                      : '/category-fallback.png'
                  }
                  alt={item.alt || item.title || 'Категория продукти'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                />
                
                {/* Gradient Overlay */}
                <GradientOverlay className="opacity-80 group-hover:opacity-90 transition-opacity duration-500 z-0" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex flex-col items-start text-white pointer-events-none">
                  <h3 className="font text-[2.8rem] font-medium tracking-wide mb-2 drop-shadow-md">
                    {item.title}
                  </h3>
                  
                  {/* Pill Button */}
                  <div className="mt-4 bg-white text-black px-8 py-3 rounded-full text-[1.4rem] font-semibold flex items-center justify-center transform transition-all duration-300 shadow-sm">
                    Разгледай
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA Button */}
        {data.button?.text && (
          <div className="mt-16 text-center">
            <Link
              href={getSlugLink(data.button.slug?.current || '')}
              className="inline-flex items-center gap-2 text-green-dark hover:text-green-9 text-[1.8rem] font-medium transition-colors group relative pb-1"
            >
              {data.button.text}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-pink-9 origin-left scale-x-100 transition-transform duration-300 group-hover:bg-green-9"></span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryCards;
