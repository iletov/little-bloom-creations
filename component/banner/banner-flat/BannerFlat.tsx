import SubHeadingMenu from '@/component/header/SubHeadingMenu';
import { cn } from '@/lib/utils';
import { BannerType } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import React from 'react';

export const BannerFlat = ({ data }: { data: BannerType }) => {
  console.log('Banner - Flat', data);

  return (
    <section
      className={cn(
        'relative h-[25.125rem] md:h-[28.125rem] overflow-hidden mb-12 ',
      )}
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}>
      <div className="fixed top-[3.925rem] w-full overflow-hidden ">
        <div className="relative w-full  h-full md:flex md:justify-center  mb-8 md:mb-12 overflow-hidden ">
          {/* <SubHeadingMenu /> */}
          {data?.bannerImageMobile?.length ? (
            <div className="w-full h-[25.125rem] md:hidden">
              <Image
                src={urlFor(data?.bannerImageMobile?.[0]).url()}
                alt={data?.title ?? ''}
                priority={true}
                fetchPriority="high"
                placeholder="empty"
                fill={true}
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 100vw "
                className={cn(
                  'w-full h-full min-h-[15.625rem] max-h-[28.125rem] ',
                )}
              />
            </div>
          ) : null}

          {data?.bannerImage?.length ? (
            <div className=" md:h-[28.125rem] hidden md:block">
              <Image
                src={urlFor(data?.bannerImage?.[0]).url()}
                alt={data?.title + 'ellipse'}
                fill={true}
                priority={true}
                fetchPriority="high"
                placeholder="empty"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 75vw, 100vw"
                className={cn('object-cover object-center')}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
