'use client';

import React, { useRef } from 'react';
import { GalleryPageProps } from '@/app/(store)/gallery/page';
import { motion, useInView } from 'framer-motion';

import Image from 'next/image';
import { BentoGridGalleryImgAndVideo } from './BentoGridImgAndVideo';

const AlbumPage = ({ data }: { data: GalleryPageProps }) => {
  console.log('data', data);

  const rawDate = data?.date;

  let formattedDate = '';
  if (rawDate) {
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) {
      formattedDate = new Intl.DateTimeFormat('bg-BG', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(parsed);
    }
  }

  const cubicBezier = [0.65, 0.05, 0.36, 1];

  return (
    <section className="min-h-screen pb-9 md:pb-12 other-bg_gradient">
      {/* Banner */}
      <div className="min-h-[23.75rem] mb-8">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 380 }}
          transition={{
            duration: 0.3,
            ease: cubicBezier,
            delay: 0.5,
          }}
          className="w-full relative overflow-hidden">
          <Image
            src={data?.coverImage}
            alt={data?.title ?? ''}
            fill={true}
            className="object-cover object-center"
          />
        </motion.div>
      </div>

      {/* heading and image  */}
      {/* <div className="grid-container flex w-full"> */}
      <div className="flex flex-col gap-4 pl-12 py-8 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0 }}>
          <span className="text-2xl font-bold text-[2.625rem] leading-[120%] font-play">
            {data?.title}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="leading-[140%] max-w-[80%] font-montserrat flex flex-col gap-1.5">
          <span className="">{data?.description}</span>
          <br />
          <span>{formattedDate}</span>
        </motion.p>
      </div>
      {/* </div> */}

      <BentoGridGalleryImgAndVideo data={data} styles="text-foreground" />
    </section>
  );
};

export default AlbumPage;
