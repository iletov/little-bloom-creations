'use client';
import { urlFor } from '@/sanity/lib/image';
import { descriptionType, ImagesType } from '@/types';
import Image from 'next/image';
import React, { useState } from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ProductPreviewProps = {
  data: {
    backgroundImages?: ImagesType[];
    backgroundColor?: string;
    title: string;
    description: descriptionType;
    button?: {
      text?: string;
      url?: string;
    };
  };
};

const ProductPreview = ({ data }: ProductPreviewProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const bgColor = (value: string) => {
    if (value === 'green') {
      return 'bg-green-1/10';
    } else {
      return 'bg-pink-5/10';
    }
  };

  const additionalImages = data?.backgroundImages?.map((image, index) => {
    return (
      <div
        onClick={() => setSelectedImage(index)}
        typeof="button"
        className="w-full cursor-pointer rounded-[1rem] overflow-clip max-h-[220px] aspect-[1/0.6] mb-4 md:mb-[initial]"
        key={index + 'prdImg'}>
        <Image
          src={urlFor(image).url()}
          alt={image?.alt || ''}
          width={640}
          height={480}
          loading="lazy"
          placeholder="blur"
          blurDataURL={'/placeholder.svg'}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover"
        />
      </div>
    );
  });

  return (
    <section
      className={cn(
        ' fhd:px-[unset] section-y-padding ',
        bgColor(data?.backgroundColor ?? ''),
      )}>
      <div className="section_wrapper md:px-[10rem] space-y-[2rem]">
        <div className="grid grid-cols-1 md:grid-cols-[4fr_5fr] gap-[1rem]">
          <header className="text-green-dark flex flex-col justify-center">
            <h2 className="text-[4.8rem] leading-[1.2] font-semibold">
              {data?.title}
            </h2>
            <PortableTextContainer
              data={data?.description}
              className="text-inherit mt-[2rem] max-w-[40ch]"
            />
            <div>
              <Button variant={'ghost'} className="mt-[4rem]">
                {data?.button?.text}
              </Button>
            </div>
          </header>
          <figure className="relative w-full rounded-[0.6rem] overflow-clip  aspect-[1/0.7] mx-auto flex justify-center items-center">
            <Image
              src={
                urlFor(data?.backgroundImages?.[selectedImage] ?? {}).url() ??
                ''
              }
              width={400}
              height={400}
              loading="lazy"
              placeholder="blur"
              blurDataURL={'/placeholder.svg'}
              alt={data?.backgroundImages?.[selectedImage]?.alt || ''}
              className="w-full h-full  object-cover"
            />
          </figure>
        </div>
        <div className="flex gap-[2rem]">{additionalImages}</div>
      </div>
    </section>
  );
};

export default ProductPreview;
