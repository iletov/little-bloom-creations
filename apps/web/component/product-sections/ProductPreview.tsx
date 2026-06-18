'use client';
import { urlFor } from '@/sanity/lib/image';
import { descriptionType, ImagesType, Title } from '@/types';
import Image from 'next/image';
import React, { useState } from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import HighlightedHeading from '../heading-description/HighlightedHeading';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type ProductPreviewProps = {
  data: {
    backgroundImages?: ImagesType[];
    backgroundColor?: string;
    heading: Title;
    position: string;
    description: descriptionType;
    button?: {
      text: string;
      slug: {
        current: string;
      };
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
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 75vw, 100vw"
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
        <div
          className={cn(
            'grid grid-cols-1  md:gap-[6rem]',
            data?.position === 'left'
              ? 'md:grid-cols-[4fr_5fr]'
              : 'md:grid-cols-[5fr_4fr]',
          )}>
          <header
            className={cn(
              'text-green-dark flex flex-col justify-center',
              data?.position === 'left' ? 'order-1' : 'order-2',
            )}>
            <HighlightedHeading
              text={data?.heading?.title}
              word={data?.heading?.highlightedWord}
              color={data?.heading?.highlightedColor}
              tag="h2"
            />
            <PortableTextContainer
              data={data?.description}
              className="text-inherit mt-[2rem] max-w-[40ch]"
            />
            <div>
              <Button asChild variant="default" className="mt-[4rem] px-8 py-6 text-[1.6rem] font-semibold bg-green-dark hover:bg-green-9 transition-colors shadow-lg shadow-green-9/20">
                <Link href={data?.button?.slug?.current ?? '/'}>
                  {data?.button?.text}
                </Link>
              </Button>
            </div>
          </header>
          <figure
            className={cn(
              'relative w-full rounded-[0.6rem] overflow-hidden aspect-[1/0.7] mx-auto flex justify-center items-center bg-gray-100',
              data?.position === 'left' ? 'order-2' : 'order-1',
            )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={
                    urlFor(data?.backgroundImages?.[selectedImage] ?? {}).url() ??
                    ''
                  }
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={'/placeholder.svg'}
                  alt={data?.backgroundImages?.[selectedImage]?.alt || ''}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 75vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </figure>
        </div>

        <div className="flex gap-[2rem]">{additionalImages}</div>
      </div>
    </section>
  );
};

export default ProductPreview;
