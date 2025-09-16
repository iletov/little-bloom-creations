import { urlFor } from '@/sanity/lib/image';
import { descriptionType, ImagesType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface CategoryCardsProps {
  data: {
    title?: string;
    description?: descriptionType;
    backgroundImages?: ImagesType[];
  };
}

const CategoryCards = ({ data }: CategoryCardsProps) => {
  return (
    <section className="bg-green-1/20">
      <div className="section_wrapper">
        <div className="grid grid-cols-3 items-center ">
          {data?.backgroundImages?.map((image: ImagesType, index: number) => (
            <Link
              href={'#'}
              key={index}
              className="aspect-square relative mask-image">
              <div className="absolute font-monsieurLa text-[3.8rem] py-[rem] top-1/2 -translate-y-[50%] left-1/2 -translate-x-1/2 w-full z-10 border-y-[1px] bg-pink-9 text-center">
                {image?.title}
              </div>
              <Image
                src={urlFor(image).url()}
                alt={image?.alt ?? ''}
                width={1024}
                height={640}
                className="w-full h-full object-cover "
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
