'use client';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { SearchBar } from '../search/SearchBar';

interface SlideBannerSectionProps {
  data: any;
}

const SlideBannerSection = ({ data }: SlideBannerSectionProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getContainerClasses = () => {
    let baseClasses = 'slide-container';

    if (hoveredIndex === 1) {
      baseClasses += ' hover-second';
    } else if (hoveredIndex === 2) {
      baseClasses += ' hover-third';
    }

    return baseClasses;
  };

  return (
    <section className=" bg-pink-1 section-y-padding">
      <div className="grid-section gap-[2rem] md:gap-[4rem] section_wrapper">
        <div className="flex flex-col justify-center items-center text-center md:text-left order-2 md:order-1 gap-4 md:gap-16">
          <header>
            <h1 className="text-[3.2rem] md:text-[4.2rem] font-semibold leading-[1.2] slide-banner__titl font-play">
              {data?.title}
            </h1>
            <PortableTextContainer data={data?.description} />
          </header>
          {/* <SearchBar /> */}
        </div>

        <div className={cn('order-2 md:order-1', getContainerClasses())}>
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
                  className="slide-image  rounded-[2rem] "
                />
                {/* <p className="slide-title text-[2.2rem] md:text-[3.2rem] vertical-text">
                {image?.alt}
              </p> */}

                {/* </div> */}
                <Link
                  className="slide-link bg-emerald-700 hover:bg-emerald-600 text-white transition-all duration-200"
                  href={''}>
                  {data?.button?.text ?? 'Вижте още'}
                </Link>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
};

export default SlideBannerSection;
