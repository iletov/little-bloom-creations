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
      text?: string;
      url?: string;
    };
    backgroundColor?: string | undefined;
  };
};

export default function Newsletter({ data }: NewsletterProps) {
  const bgColor = (value: string) => {
    if (value === 'green') {
      return 'bg-green-1';
    } else {
      return 'bg-pink-5/60';
    }
  };

  return (
    <section
      className={cn('py-[1.2rem]', bgColor(data?.backgroundColor ?? ''))}>
      <div className="section_wrapper grid grid-cols-[2fr_1fr] items-center">
        <header className="  text-center space-y-8 ">
          <HighlightedHeading
            text={data?.heading?.title}
            word={data?.heading?.highlightedWord}
            color={data?.heading?.highlightedColor}
            tag="h2"
          />
          <div className="space-y-4 grid justify-center items-center">
            <PortableTextContainer data={data?.description} />
          </div>

          <NewsletterInput />
        </header>

        <div className=" mask-image-transparent ">
          <Image
            src={urlFor(data?.backgroundImage).url()}
            alt={data?.heading?.title}
            width={100}
            height={100}
            sizes="50vw"
            className="w-full object-cover h-full"
          />
        </div>
      </div>
    </section>
  );
}
