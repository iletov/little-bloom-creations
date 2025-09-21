import { urlFor } from '@/sanity/lib/image';
import { descriptionType, ImagesType, Title } from '@/types';
import Image from 'next/image';
import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { Button } from '@/components/ui/button';
import SocialMedComponent from '../social-media/SocialMedComponent';
import HighlightedHeading from '../heading-description/HighlightedHeading';

interface FullBackgroundProps {
  data: {
    heading: Title;
    description?: descriptionType | null | undefined;
    backgroundImage: ImagesType;
    backgroundImages?: ImagesType[];
    button?: {
      text?: string;
      url?: string;
    };
  };
}

const FullBackgroundSection = ({ data }: FullBackgroundProps) => {
  return (
    <section className="relative full-background__clip">
      <div className="relative w-full min-h-[45dvh] ">
        <div className="absolute inset-0 z-10 bg-green-dark bg-opacity-40" />
        <Image
          src={urlFor(data?.backgroundImage).url()}
          alt={data?.heading?.title ?? 'background-image'}
          fill={true}
          sizes="100vw"
          className="object-cover"
        />

        <SocialMedComponent />

        <div className="section_wrapper absolute inset-0 flex flex-col gap-[4rem] items-center justify-center z-10">
          <header className="space-y-[2rem] text-pink-1 text-center">
            <HighlightedHeading
              text={data?.heading?.title}
              word={data?.heading?.highlightedWord}
              color={data?.heading?.highlightedColor}
              tag="h2"
              className="max-size__fullBackgroun z-10 text-pink-1"
            />
            <PortableTextContainer
              data={data?.description}
              className="text-inherit "
            />
          </header>
          <Button className="z-10">{data?.button?.text}</Button>
        </div>
      </div>
    </section>
  );
};

export default FullBackgroundSection;
