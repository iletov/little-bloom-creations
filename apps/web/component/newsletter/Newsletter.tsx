import { descriptionType, ImagesType, Title } from '@/types';
import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Input } from '@/components/ui/input';
import NewsletterInput from './NewsletterInput';
import { cn } from '@/lib/utils';
import HighlightedHeading from '../heading-description/HighlightedHeading';

type NewsletterProps = {
  data: {
    heading: Title;
    description: descriptionType;
    backgroundImage: ImagesType;
    mobileImage: ImagesType;
    button?: {
      text: string;
      slug: {
        current: string;
      };
    };
    backgroundColor?: string | undefined;
  };
};

export default function Newsletter({ data }: NewsletterProps) {
  const bgColor = (value: string) => {
    if (value === 'green') {
      return 'bg-green-1';
    } else {
      return 'bg-pink-5/40';
    }
  };

  return (
    <section
      className={cn('py-16 md:py-[8rem]', bgColor(data?.backgroundColor ?? ''))}>
      <div className="section_wrapper grid grid-cols-1 lg:grid-cols-[1fr_1fr] items-center gap-12 lg:gap-16">
        <header className="flex flex-col text-center lg:text-left space-y-6 md:space-y-8 order-2 lg:order-1">
          <HighlightedHeading
            text={data?.heading?.title}
            word={data?.heading?.highlightedWord}
            color={data?.heading?.highlightedColor}
            tag="h2"
            className="text-[3.2rem] md:text-[4.8rem] leading-[1.2]"
          />
          <div className="text-[1.6rem] md:text-[1.8rem] text-slate-700 leading-relaxed max-w-[600px] mx-auto lg:mx-0">
            <PortableTextContainer data={data?.description} />
          </div>

          <div className="pt-2 w-full max-w-[500px] mx-auto lg:mx-0">
            <NewsletterInput />
          </div>
        </header>

        <div className="w-full flex justify-center order-1 lg:order-2">
          <div className="mask-image-transparent w-[80%] max-w-[400px] lg:max-w-[510px] aspect-square relative">
            <Image
              src={urlFor(data?.backgroundImage).url()}
              alt={data?.heading?.title || 'Newsletter'}
              fill
              sizes="(max-width: 1024px) 80vw, 50vw"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
