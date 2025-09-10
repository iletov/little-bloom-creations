'use client';
import Image from 'next/image';
import React from 'react';
import { urlFor } from '@/sanity/lib/image';
import { BannerType, internalGroqTypeReferenceTo, Slug } from '@/sanity.types';
import { cn } from '@/lib/utils';
import SubHeadingMenu from '@/component/header/SubHeadingMenu';
import {
  SanityImageCrop,
  SanityImageHotspot,
} from '@sanity/image-url/lib/types/types';
import { motion } from 'motion/react';

export interface IconsCards {
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
    heading: string;
    slug?: Slug;
    _key?: string;
  }[];
}

interface Props {
  data: BannerType;
  subData?: IconsCards | undefined;
}

export const BannerBottomCurve = ({ data, subData }: Props) => {
  const currentSlug = ['/'];
  const dataSlug = data?.slug?.current;

  const removeSvg =
    dataSlug && !currentSlug.includes(dataSlug) ? 'svg-image' : '';

  return (
    <motion.section
      initial={{ opacity: 0.2, x: 'var(--initial-x)', y: 'var(--initial-y)' }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut', delay: 0 }}
      className="relative border-[2px] border-lightPurple/80 md:max-w-[85.375rem] md:mx-auto rounded-2xl h-full md:flex md:justify-center  mb-8 md:mb-12  overflow-hidden mx-3 ">
      {subData ? <SubHeadingMenu data={subData} /> : null}
      {data?.bannerImageMobile?.length ? (
        <div className="w-full md:hidden">
          <Image
            src={urlFor(data?.bannerImageMobile?.[0]).url()}
            alt={data?.title ?? ''}
            priority={true}
            fetchPriority="high"
            placeholder="empty"
            // fill={true}
            width={1000}
            height={1000}
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 100vw "
            className={cn(
              'w-full h-full min-h-[25.125rem]  rounded-2xl object-cover object-top',
            )}
          />
        </div>
      ) : null}

      {data?.bannerImage?.length ? (
        <div className=" md:h-[28rem] hd:h-[32rem] fhd:h-[36rem] hidden md:block">
          <Image
            src={urlFor(data?.bannerImage?.[0]).url()}
            alt={data?.title + 'ellipse'}
            fill={true}
            priority={true}
            fetchPriority="high"
            placeholder="empty"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 75vw, 100vw"
            className={cn('object-cover object-center', removeSvg)}
          />
        </div>
      ) : null}
    </motion.section>
  );
};
