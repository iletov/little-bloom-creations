'use client';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { SearchBar } from '../search/SearchBar';
import { Button } from '@/components/ui/button';

interface SlideBannerSectionProps {
  data: any;
}

const SlideBannerSection = ({ data }: SlideBannerSectionProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // const getContainerClasses = () => {
  //   let baseClasses = 'slide-container';

  //   if (hoveredIndex === 1) {
  //     baseClasses += ' hover-second';
  //   } else if (hoveredIndex === 2) {
  //     baseClasses += ' hover-third';
  //   }

  //   return baseClasses;
  // };

  const getGridTemplateColumns = () => {
    const columns = data?.backgroundImages.map((_: any, index: number) => {
      if (hoveredIndex !== null) {
        return hoveredIndex === index ? '3fr' : '1fr';
      }

      return index === 0 ? '3fr' : '1fr';
    });

    return columns.join(' ');
  };

  return (
    <section className=" bg-green-1/40 section-y-padding">
      <div className="grid-section gap-[2rem] md:gap-[4rem] section_wrapper">
        <div className="flex flex-col justify-center  text-center md:text-left order-2 md:order-1 gap-4 md:gap-16">
          <header className="space-y-4 slide-banner__title">
            <h1 className="text-[3.2rem] md:text-[4.2rem] font-semibold leading-[1.2]  font-play">
              {data?.title}
            </h1>
            <PortableTextContainer data={data?.description} />
            {data?.button?.text || data?.button?.link ? (
              <Button className="bg-green-5 text-green-1">
                <Link href={data?.button?.link ?? ''}>
                  {data?.button?.text}
                </Link>
              </Button>
            ) : null}
          </header>
          {/* <SearchBar /> */}
        </div>

        <div
          className={cn('order-2 md:order-1 slide-container')}
          style={{
            gridTemplateColumns: getGridTemplateColumns(),
            gridTemplateRows: '1fr',
          }}>
          {data?.backgroundImages &&
            data?.backgroundImages.length > 0 &&
            data?.backgroundImages.map((image: any, index: number) => (
              <article
                key={index + 'slideBanner'}
                className={cn(
                  'slide',
                  hoveredIndex === null && index === 0 ? 'first-default' : '',
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}>
                <Image
                  width={1200}
                  height={600}
                  src={urlFor(image).url()}
                  alt={image?.alt ?? ''}
                  className="slide-image  rounded-[1rem] "
                />
                {/* <p className="slide-title text-[2.2rem] md:text-[3.2rem] vertical-text">
                {image?.alt}
              </p> */}

                {/* </div> */}
                <p className="slide-link  text-pink-1 transition-all duration-200 border-b-[1px] ">
                  {image?.title ?? 'Вижте още'}
                </p>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
};

export default SlideBannerSection;
