import { urlFor } from '@/sanity/lib/image';
import { descriptionType, ImagesType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import HighlightedHeading from '../heading-description/HighlightedHeading';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import FloralDivider from '../heading-description/FloralDivider';

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
    <section className="bg-green-0/40 border-y border-green-5/10 py-16 sm:py-20 lg:py-24">
      <div className="section_wrapper px-6 sm:px-8 xl:px-0">
        {/* Section Header */}
        {(data.heading?.title || data.title) && (
          <header className="mx-auto mb-12 max-w-[84rem] text-center lg:mb-16 space-y-4">
            {data.heading?.title ? (
              <HighlightedHeading
                text={data.heading.title}
                word={data.heading.highlightedWord}
                color={data.heading.highlightedColor ?? 'var(--green-5)'}
                className="mx-auto max-w-[120rem] text-[3.2rem] sm:text-[4rem] lg:text-[4.8rem] font-semibold text-green-dark leading-[1.2]"
                tag="h2"
              />
            ) : (
              <h2 className="text-[3.2rem] font-semibold leading-[1.2] text-green-dark sm:text-[4rem] lg:text-[4.8rem]">
                {data.title}
              </h2>
            )}

            <div className="grid place-items-center gap-5 mt-4">
              {data.description && (
                <PortableTextContainer
                  data={data.description}
                  className="mx-auto max-w-[76rem] text-[1.5rem] leading-[1.6] text-slate-600 sm:text-[1.6rem]"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map(item => (
              <Link
                href={getSlugLink(item.slug)}
                key={`${item.slug}-${item.title}`}
                className="aspect-[4/5] relative w-full overflow-hidden rounded-lg group block shadow-sm hover:shadow-md transition-all duration-300 bg-green-1/10"
              >
                <Image
                  src={
                    item.image
                      ? urlFor(item.image).url()
                      : '/category-fallback.png'
                  }
                  alt={item.alt || item.title || 'Категория продукти'}
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Text Overlay Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-green-dark/85 backdrop-blur-[2px] py-5 px-6 text-center text-white z-10 transition-colors duration-300 group-hover:bg-green-dark">
                  <span className="font-serif text-[2.2rem] font-medium tracking-wide">
                    {item.title}
                  </span>
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
              className="inline-flex items-center gap-2 text-green-dark hover:text-green-9 font-serif text-[1.8rem] font-medium transition-colors group relative pb-1"
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
