'use client';

import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { EsotericaStore, MusicStore } from '@/sanity.types';
import { Reference } from 'sanity';
import { VideoComponentAspect } from '../video-component/VideoComponentAspect';
import { Separator } from '../separator/Separator';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ProductPros {
  product: MusicStore | EsotericaStore;
}

export const ProductImagesContainer = ({ product }: ProductPros) => {
  console.log('product', product);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const additionalImages = product?.images?.map((image, index) => {
    return (
      <div
        onClick={() => setSelectedImage(index)}
        className="max-w-[120px] cursor-pointer max-h-[120px] md:max-w-[160px] md:max-h-[160px] bg-transparent border-[1px] border-primaryPurple px-3 py-3  rounded-[12px] mb-4 md:mb-[initial]"
        key={index + 'prdImg'}>
        <Image
          src={urlFor(image).url()}
          alt={product?.Name || ''}
          width={100}
          height={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-contain"
        />
      </div>
    );
  });

  return (
    <div className="w-full mb-4 sm:mb-0 space-y-6">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
          delay: 0.2,
          staggerChildren: 0.1,
        }}
        className="relative w-full md:w-[30rem] md:h-[30rem] mx-auto flex justify-center items-center overflow-hidden">
        <Image
          src={urlFor(product?.images?.[selectedImage] as Reference).url()}
          alt={product?.Name || ''}
          width={200}
          height={200}
          className="w-full h-full md:max-w-[30rem] md:max-h-[30rem] object-contain"
        />
      </motion.div>

      {/* IMAGES */}
      <motion.article
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
          delay: 0.4,
          staggerChildren: 0.1,
        }}
        className="w-full overflow-x-scroll md:overflow-x-visible rounded-[12px] flex gap-4">
        {additionalImages}
      </motion.article>
      <Separator className=" bg-mango" />
    </div>
  );
};
