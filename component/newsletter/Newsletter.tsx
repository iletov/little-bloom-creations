import { descriptionType, ImagesType } from '@/types';
import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Input } from '@/components/ui/input';
import NewsletterInput from './NewsletterInput';

type NewsletterProps = {
  data: {
    title: string;
    description: descriptionType;
    backgroundImage: ImagesType;
    mobileImage: ImagesType;
    button?: {
      text?: string;
      url?: string;
    };
  };
};

export default function Newsletter({ data }: NewsletterProps) {
  return (
    <section className="bg-pink-5/60 py-[1.2rem]">
      <div className="section_wrapper grid grid-cols-[2fr_1fr] items-center">
        <header className="  text-center space-y-8 ">
          <h2 className="text-[2.4rem] md:text-[4.8rem] font-semibold leading-[1.3] font-orbitron text-green-dark">
            {data?.title}
          </h2>
          <div className="space-y-4 grid justify-center items-center">
            <PortableTextContainer data={data?.description} />
          </div>

          <NewsletterInput />
        </header>

        <div className=" mask-image-transparent z-50">
          <Image
            src={urlFor(data?.backgroundImage).url()}
            alt={data?.title}
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
