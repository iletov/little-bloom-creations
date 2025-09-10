'use client';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { BannerType } from '@/sanity.types';
import { PortableText } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import { SearchBar } from '@/component/search-bar/SearchBar';
import { Heading } from '@/component/text/Heading';
import { Description } from '@/component/text/Description';

interface ImageContainerProps {
  data?: BannerType;
  ref?: React.Ref<HTMLDivElement>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}

interface TextContainerProps {
  data?: BannerType;
  move: MotionValue<number>;
  textOpacity: MotionValue<number>;
}

const HomeBanner = ({ data }: { data: BannerType }) => {
  // console.log('banner--->', data);
  const target_ref = useRef<HTMLDivElement>(null);
  const imageProgress = useScroll({
    target: target_ref,
    offset: ['end end', 'end start'],
  });
  const textProgress = useScroll({
    target: target_ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(imageProgress.scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(imageProgress.scrollYProgress, [0, 1], [1, 0]);

  const move = useTransform(textProgress.scrollYProgress, [0, 1], [100, -100]);
  const textOpacity = useTransform(
    textProgress.scrollYProgress,
    [1, 1],
    [0, 1],
  );

  return (
    <section className="relative mt-2 w-full h-full xl:max-w-[calc(100%-8rem)] mx-auto min-h-[20rem] md:min-h-[25rem] hd:min-h-[30rem] fhd:min-h-[35rem]">
      <motion.div
        ref={target_ref}
        style={{ scale }}
        className="absolute inset-0 z-20 rounded-lg overflow-hidden">
        <div className="hidden md:block">
          <Image
            src={urlFor(data?.bannerImage?.[0] ?? []).url()}
            alt={data?.title ?? ''}
            fill={true}
            priority
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 100vw"
            className="object-cover object-center block aspect-video"
          />
        </div>
        <div className=" w-full h-full md:hidden">
          <Image
            src={urlFor(data?.bannerImageMobile?.[0] ?? []).url()}
            alt={data?.title ?? ''}
            width={600}
            height={600}
            priority
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 100vw"
            className="w-full h-full object-contain aspect-[1/1.75] block"
          />
        </div>
        {/* <div className="absolute inset-0 z-30 bg-black/40" /> */}
      </motion.div>
      <BannerText data={data} move={move} textOpacity={textOpacity} />
    </section>
  );
};

export default HomeBanner;

// const HeadingContainer = ({ data }: { data: BannerType }) => {
//   return (
//     <header className="section_wrapper py-6 md:py-16 space-y-3 md:space-y-6">
//       <h1 className="text-[3rem] font-sans md:text-[5rem] leading-[120%] font-bold text-center uppercase">
//         {data?.heading}
//       </h1>
//       <div className=" text-center font-mono">
//         {Array.isArray(data?.bannerSection?.body) && (
//           <PortableText value={data?.bannerSection?.body} />
//         )}
//       </div>
//     </header>
//   );
// };

const BannerText = ({ move, textOpacity, data }: TextContainerProps) => {
  return (
    <motion.div
      style={{ y: move, opacity: textOpacity }}
      className="absolute left-0 right-0 top-10 z-30 text-white flex flex-col items-left justify-center gap-2  xl:max-w-[60%] xl:mx-auto">
      <Heading
        data={data?.heading}
        className=" glossy-text text-[3rem] xl:text-[6rem] xl:text-left  font-semibold"
      />
      <div className="flex flex-col gap-4 xl:gap-6 justify-center w-full max-w-[70%] xl:max-w-[initial] mx-auto">
        <Heading
          data={data?.bannerTitle}
          className="text-left w-full max-w-[80%] futuristic-text font-semibold"
        />
        {Array.isArray(data?.description) && (
          <div className="text-left futuristic-text font-orbitron">
            <PortableText value={data?.description} />
          </div>
        )}
      </div>
    </motion.div>
  );
};
