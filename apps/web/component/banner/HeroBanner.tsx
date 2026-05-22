import { descriptionType, ImagesType, Title } from '@/types';
import Image from 'next/image';
import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import HighlightedHeading from '../heading-description/HighlightedHeading';
import { Slug } from '@/sanity.types';

interface HeroBannerProps {
  data: {
    heading: Title;
    description?: descriptionType | null | undefined;
    backgroundImage: ImagesType;
    mobileImage: ImagesType;
    size?: string;
    button?: {
      text?: string;
      slug?: {
        current: string | null | undefined;
      };
    };
  };
}

const HeroBanner = ({ data }: HeroBannerProps) => {
  const bannerSize = (value: string) => {
    switch (value) {
      case 'large':
        return 'h-[58rem]';
      case 'small':
        return 'h-[48rem]';
      default:
        return 'h-[58rem]';
    }
  };

  return (
    <section className="bg-pink-1 ">
      <div
        className={cn(
          'relative w-full h-[58rem]',
          bannerSize(data?.size ?? ''),
        )}>
        {/* <div className="absolute inset-0 z-10 bg-green-dark svg-image bg-opacity-60" /> */}
        <Image
          src={urlFor(data?.backgroundImage).url()}
          alt={data?.heading?.title ?? 'background-image'}
          fill={true}
          fetchPriority="high"
          priority
          sizes="100vw"
          className="object-cover w-full h-full"
        />

        {/* <SocialMedComponent /> */}

        <header className="absolute grid-section__hero  z-10 w-full h-full place-content-end pb-[6%] place-items-stretch max-w-[85%] inset-x-0 mx-auto">
          <HighlightedHeading
            text={data?.heading?.title}
            word={data?.heading?.highlightedWord}
            color={data?.heading?.highlightedColor}
            tag="h1"
            className="text-pink-1 text-[7.2rem] font-bold leading-[1.2] max-w-[10ch]"
          />
          <div className="justify-self-center grid gap-8 ">
            <PortableTextContainer
              data={data?.description}
              className="text-end text-pink-1"
            />
            <Button className="justify-self-end ">
              <Link href={data?.button?.slug?.current ?? '/'}>
                {data?.button?.text}
              </Link>
            </Button>
          </div>
        </header>
      </div>
    </section>
  );
};

export default HeroBanner;
