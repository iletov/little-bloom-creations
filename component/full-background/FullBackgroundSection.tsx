import { urlFor } from '@/sanity/lib/image';
import { descriptionType, ImagesType } from '@/types';
import Image from 'next/image';
import React from 'react';

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
        <Image
          src={urlFor(data?.backgroundImage).url()}
          alt={data?.title ?? 'background-image'}
          fill={true}
          sizes="100vw"
          className="object-cover mask-image"
        />

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
