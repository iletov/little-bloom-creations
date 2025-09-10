'use client';
import { ImageType } from '@/sanity.types';
import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { PortableTextBlockStyle } from '@portabletext/types';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { motion } from 'framer-motion';

interface MultiSectionProps {
  data: {
    _id?: string | undefined;
    heading?: string | undefined;
    description?: PortableTextBlockStyle;
    image?: ImageType;
  }[];
}

export const MultiSection = ({ data }: MultiSectionProps) => {
  const aboutUsComponents = data?.map((item, index) => {
    const isOdd = index % 2 === 0;

    // Variants for the container
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.1,
        },
      },
    };

    // Variants for children elements
    const childVariants = {
      hidden: {
        opacity: 0,
        y: 30,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      },
    };

    // Variants for the image/text sections with direction
    const sectionVariants = {
      hidden: {
        opacity: 0,
        x: isOdd ? -40 : 40,
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.8,
          ease: 'easeOut',
        },
      },
    };
    const imageVariants = {
      hidden: {
        opacity: 0,
        x: isOdd ? 40 : -40,
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.8,
          ease: 'easeOut',
        },
      },
    };

    return (
      <motion.article
        className=" w-auto lg:px-20 h-full"
        key={item?._id}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -50px 0px' }}>
        {item?.heading ? (
          <motion.header
            className=" heading2 py-8 xl:py-10 text-center w-auto h-fit"
            variants={childVariants}>
            <h2>{item?.heading}</h2>
          </motion.header>
        ) : null}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 min-h-[25rem]`}>
          <motion.div
            className={isOdd ? 'lg:order-1' : 'lg:order-2'}
            variants={sectionVariants}>
            <PortableTextContainer data={item?.description} />
          </motion.div>
          <motion.figure
            variants={imageVariants}
            className={` 
            relative w-full h-full rounded-xl overflow-hidden min-h-[20rem lg:min-h-[unset] ${isOdd ? 'lg:order-2' : 'lg:order-1'}`}>
            {item?.image && (
              <Image
                src={urlFor(item.image).url() ?? ''}
                alt={item?.heading ?? ''}
                // fill={true}
                width={1200}
                height={1200}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 75vw"
                className="object-cover w-full h-full aspect-[1/0.5]"
              />
            )}
          </motion.figure>
        </div>
      </motion.article>
    );
  });

  return (
    <section className="grid gap-8 xl:gap-16 section_wrapper min-h-screen">
      {aboutUsComponents}
    </section>
  );
};
