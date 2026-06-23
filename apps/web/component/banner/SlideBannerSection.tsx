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
    <section className=" bg-green-1/40 section-y-padding">
      <div className="grid-section gap-[2rem] md:gap-[4rem] section_wrapper">
        <div className="flex flex-col justify-center text-center md:text-left order-1 gap-4 md:gap-16">
          <header className="space-y-4 slide-banner__title">
            <HighlightedHeading
              text={data?.heading?.title}
              word={data?.heading?.highlightedWord}
              color={data?.heading?.highlightedColor}
              tag="h2"
            />
            <PortableTextContainer data={data?.description} />
            {data?.button?.text || data?.button?.url ? (
              <Button className="bg-green-5 text-green-1">
                <Link href={data?.button?.slug?.current ?? ''}>
                  {data?.button?.text}
                </Link>
              </Button>
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

              const Wrapper: any = href ? Link : 'article';

              return (
                <Wrapper
                  key={index + 'slideBanner'}
                  {...(href ? { href } : {})}
                  className={cn(
                    'slide',
                    hoveredIndex === null && index === 0 ? 'first-default' : '',
                  )}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}>
                  <Image
                    width={1200}
                    height={600}
                    src={urlFor(imageSrc).url()}
                    alt={imageSrc?.alt ?? ''}
                    className="slide-image rounded-[1rem]"
                  />
                  <div 
                    className="slide-overlay rounded-[1rem] bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" 
                    style={{ gridArea: '1/1' }} 
                  />
                  <p className="slide-link text-white transition-all duration-400 border-b-[1px] border-white/50">
                    {title}
                  </p>
                </Wrapper>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default SlideBannerSection;
