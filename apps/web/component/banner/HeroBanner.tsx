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
import { GradientOverlay } from '@/components/ui/gradient-overlay';

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
        return 'min-h-[100vh]';
      case 'small':
        return 'min-h-[60vh] lg:min-h-[50vh]';
      default:
        return 'min-h-[100vh]';
    }
  };

  return (
    <section 
      className="bg-pink-1" 
      data-hero-banner="true"
      data-hero-size={data?.size === 'small' ? 'small' : 'large'}
    >
      <div
        className={cn(
          'relative w-full flex flex-col',
          bannerSize(data?.size ?? ''),
        )}>
        <GradientOverlay className="via-black/40" />
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

        <header className={cn("section_wrapper absolute z-10 w-full h-full flex flex-col justify-end pb-[35%] md:pb-[8%] mx-auto inset-x-0", data?.size === 'small' ? 'pb-[25%] md:pb-[8%]' : 'pb-[35%] md:pb-[8%]')}>
          <div className="flex flex-col items-start gap-4 md:gap-6 max-w-4xl">
            <HighlightedHeading
              text={data?.heading?.title}
              word={data?.heading?.highlightedWord}
              color={data?.heading?.highlightedColor}
              tag="h1"
              className="text-white text-[4rem] md:text-[5.6rem] lg:text-[7.2rem] font-bold leading-[1.1]"
            />
            
            {data?.description && (
              <div className="text-[1.8rem] md:text-[2.2rem] font-medium">
                <PortableTextContainer 
                  data={data.description} 
                  className="text-white prose-p:text-white prose-headings:text-white prose-strong:text-white" 
                />
              </div>
            )}
            
            {data?.button?.text && (
              <Button 
                asChild 
                className="mt-4 relative z-20 bg-white text-black hover:text-black rounded-full px-12 py-7 text-[1.6rem] font-bold h-auto shadow-md "
              >
                <Link href={data?.button?.slug?.current ?? '/'}>
                  {data?.button?.text}
                </Link>
              </Button>
            )}
          </div>
        </header>
      </div>
    </section>
  );
};

export default HeroBanner;
