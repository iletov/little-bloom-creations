import { urlFor } from '@/sanity/lib/image';
import { descriptionType, ImagesType } from '@/types';
import Image from 'next/image';
import React from 'react';
import VerticalLine from '../separator/VerticalLine';
import SocialMedComponent from '../social-media/SocialMedComponent';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import WaveBorder from '../icons/wave-border';
import { cn } from '@/lib/utils';

interface FullBackgroundProps {
  data: {
    title: string;
    description?: descriptionType | null | undefined;
    backgroundImage: ImagesType;
    backgroundImages?: ImagesType[];
  };
}

const FullBackgroundSection = ({ data }: FullBackgroundProps) => {
  return (
    <section className="relative">
      <div className="relative w-full h-[60dvh] ">
        <div className="absolute inset-0 z-10 bg-black bg-opacity-30" />
        <Image
          src={urlFor(data?.backgroundImage).url()}
          alt={data?.title ?? 'background-image'}
          fill={true}
          sizes="100vw"
          className="object-cover "
        />

        <SocialMedComponent />

        <header className="section_wrapper">
          <h2 className="absolute top-1/2 translate-y-[11%] right-0 text-pink-9 text-[8rem] font-bold leading-[1.2] max-size__fullBackground z-10">
            {data?.title}
          </h2>
        </header>
      </div>
    </section>
  );
};

export default FullBackgroundSection;
