import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
  Slug,
} from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import React from 'react';

export interface IconsCardsProps {
  data: {
    _id?: string;
    sectionTitle?: string;
    sectionSubheading?: string;
    slug?: Slug;
    cards?: {
      images?: Array<{
        asset?: {
          _ref: string;
          _type: 'reference';
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: 'sanity.imageAsset';
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: 'image';
        _key: string;
      }>;
      title?: string;
      _key?: string;
    }[];
  };
}

export const IconsCards = ({ data }: IconsCardsProps) => {
  return (
    <section className="w-full md:max-w-[calc(100%-12rem)] py-4 lg:py-8 mx-auto md:rounded-2xl overflow-hidden bg-midGold">
      <header className="heading2 pb-4 text-primaryPurple text-center">
        <h2>{data?.sectionTitle}</h2>
      </header>
      <div className="grid grid-cols-2 gap-y-8 md:gap-y-[unset] justify-items-center md:flex md:justify-evenly relative ">
        {data?.cards?.map(card => (
          <div
            key={card?._key}
            className="flex flex-col gap-4 items-start justify-start relative w-full  max-w-[110px] lg:max-w-[130px]">
            {card?.images?.length ? (
              <figure className=" flex justify-center items-center bg-foreground h-[110px] w-[110px] lg:w-[130px] lg:h-[130px] rounded-full">
                <Image
                  src={urlFor(card?.images?.[0]).url() ?? ''}
                  alt={card?.title ?? ''}
                  width={100}
                  height={100}
                  className="w-full max-w-12 lg:min-w-8 lg:max-w-14 h-full object-contain"
                />
              </figure>
            ) : null}
            <h3 className="text-center w-full  text-wrap text-primaryPurple text-[1.125rem] font-semibold font-play">
              {card?.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};
