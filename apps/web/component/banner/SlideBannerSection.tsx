'use client';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { SearchBar } from '../search/SearchBar';
import { Button } from '@/components/ui/button';
import HighlightedHeading from '../heading-description/HighlightedHeading';
import { GradientOverlay } from '@/components/ui/gradient-overlay';

interface SlideBannerSectionProps {
  data: any;
}

const SlideBannerSection = ({ data }: SlideBannerSectionProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const items = data?.products?.length > 0 ? data.products : data?.backgroundImages || [];

  const getGridTemplateColumns = () => {
    const columns = items.map((_: any, index: number) => {
      if (hoveredIndex !== null) {
        return hoveredIndex === index ? '4fr' : '1fr';
      }

      return index === 0 ? '4fr' : '1fr';
    });

    return columns.join(' ');
  };

  return (
    <section className="bg-green-1/20 section-y-padding min-h-[55vh] flex flex-col justify-center">
      <div className="grid-section gap-[2rem] md:gap-[4rem] section_wrapper items-center">
        <div className="flex flex-col justify-center text-center md:text-left order-1 gap-4 md:gap-16">
          <header className="space-y-4 slide-banner__title">
            <HighlightedHeading
              text={data?.heading?.title}
              word={data?.heading?.highlightedWord}
              color={data?.heading?.highlightedColor}
              className="text-[3.6rem] sm:text-[4.6rem] lg:text-[5.6rem] leading-[1.1] font-semibold text-green-dark"
              tag="h2"
            />
            <div className="text-[1.6rem] sm:text-[1.8rem] leading-[1.6] text-slate-600">
              <PortableTextContainer data={data?.description} />
            </div>
            {data?.button?.text || data?.button?.url ? (
              <div className="pt-4">
                <Button className="bg-green-dark hover:bg-green-9 transition-colors text-green-1 px-8 py-6 text-[1.6rem] font-semibold shadow-lg shadow-green-9/20">
                  <Link href={data?.button?.slug?.current ?? ''}>
                    {data?.button?.text}
                  </Link>
                </Button>
              </div>
            ) : null}
          </header>
          {/* <SearchBar /> */}
        </div>

        <div
          className={cn('order-2 slide-container')}
          style={{
            gridTemplateColumns: getGridTemplateColumns(),
            gridTemplateRows: '1fr',
          }}>
          {items.length > 0 &&
            items.map((item: any, index: number) => {
              const isProduct = !!item.images;
              const imageSrc = isProduct ? item.images[0] : item;
              const title = isProduct ? item.name : (item.title ?? 'Вижте още');
              const href = isProduct 
                ? `/categories/${item.category?.slug?.current}/${item.slug?.current}` 
                : null;

              return (
                <article
                  key={index + 'slideBanner'}
                  className={cn(
                    'slide',
                    hoveredIndex === null && index === 0 ? 'first-default' : '',
                  )}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}>
                  {href && (
                    <Link href={href} className="absolute inset-0 z-20" aria-label={title} />
                  )}
                  <Image
                    width={1200}
                    height={600}
                    src={urlFor(imageSrc).url()}
                    alt={imageSrc?.alt ?? ''}
                    className="slide-image "
                  />
                    {/* Gradient Overlay */}
                <GradientOverlay className="rounded-[1rem] opacity-90 z-0" /> 
                  <div className="slide-link flex flex-col items-start transition-all duration-400 pointer-events-none z-20">
                    <h3 className=" text-[2.8rem] font-medium tracking-wide mb-2 drop-shadow-md text-white">
                      {title}
                    </h3>
                    <div className="mt-4 bg-white text-black px-8 py-3 rounded-full text-[1.4rem] font-semibold flex items-center justify-center transform transition-all duration-300 shadow-sm hover:scale-105 hover:bg-gray-50">
                      Разгледай
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default SlideBannerSection;
