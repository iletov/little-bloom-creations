'use client';
import React, { Ref, Reference } from 'react';
import { Heading } from '../text/Heading';
import Link from 'next/link';
import Image from 'next/image';
import { GalleryPageProps } from '@/app/(store)/gallery/page';
import { motion } from 'framer-motion';
import { Aperture } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
type GalleryProps = {
  data: GalleryPageProps;
  index: number;
};

const GalleryContainer = ({ data, index }: GalleryProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.2 }}
      // className="relative min-h-[10rem] py-1 rounded-[1rem] overflow-hidden"
    >
      <motion.div
        whileTap={{ scale: 0.96 }}
        className="relative min-h-[10rem] py-1 rounded-[1rem] overflow-hidden">
        <Link
          // href={'#'}
          href={`/gallery/${data?.slug.current}`}
          key={data?._id}>
          {data?.title ? (
            <Heading
              data={data?.title ?? ''}
              className=" mb-8 md:mb-12 flex-wrap max-w-[90%] mx-auto"
            />
          ) : null}
          <motion.div
            className="group w-full h-full"
            whileHover="hover"
            initial="rest"
            animate="rest">
            <Image
              src={
                data?.coverImage ??
                (data?.images?.[0] && urlFor(data?.images[0]).url()) ??
                ''
              }
              alt={data?.title ?? ''}
              fill={true}
              className="object-cover"
            />

            {/* Overlay content */}
            <motion.div
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 },
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/30 flex items-end">
              <motion.div
                variants={{
                  rest: { y: 35, opacity: 0 },
                  hover: { y: 5, opacity: 1 },
                }}
                transition={{ duration: 0.2 }}
                className="w-full p-4 bg-black/70 text-white flex items-center justify-between min-h-[6.25rem] ">
                <Heading
                  data={data?.title ?? ''}
                  className="flex-wrap text-left text-[1.5rem] font-comfortaa opacity-70"
                />
                <Aperture className="w-10 h-10 opacity-70" strokeWidth={0.4} />
              </motion.div>
            </motion.div>
          </motion.div>
        </Link>
      </motion.div>
    </motion.article>
  );
};

export default GalleryContainer;
