import { descriptionType, ImagesType } from '@/types';
import Image from 'next/image';
import React from 'react';
import SocialMedComponent from '../social-media/SocialMedComponent';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  data: {
    title: string;
    description?: descriptionType | null | undefined;
    backgroundImage: ImagesType;
    mobileImage: ImagesType;
    button?: {
      text?: string;
      url?: string;
    };
  };
}

const HeroBanner = ({ data }: HeroBannerProps) => {
  console.log('data', data);
  return (
    <section className="bg-pink-1 banner-y-padding max-w-[1920px] mx-auto">
      <div className="relative w-full h-full min-h-[75dvh]  rounded-[1.6rem] overflow-clip">
        <div className="absolute inset-0 z-10 bg-black bg-opacity-30" />
        <Image
          src={urlFor(data?.backgroundImage).url()}
          alt={data?.title ?? 'background-image'}
          fill={true}
          sizes="100vw"
          className="object-cover "
        />

        {/* <SocialMedComponent /> */}

        <header className="absolute grid-section__hero  z-10 w-full h-full place-content-end pb-[5%] place-items-stretch max-w-[85%] inset-x-0 mx-auto">
          <h2 className=" text-pink-1 text-[4.8rem] font-bold leading-[1.2] ">
            {data?.title}
          </h2>
          <div className="justify-self-center grid gap-8 ">
            <PortableTextContainer
              data={data?.description}
              className="text-end text-pink-1"
            />
            <Button className="justify-self-end">{data?.button?.text}</Button>
          </div>
        </header>
      </div>
    </section>
  );
};

export default HeroBanner;
