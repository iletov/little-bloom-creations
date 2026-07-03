'use client';

import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { motion } from 'framer-motion';
import { descriptionType, ImagesType, ListItems, Title } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import HighlightedHeading from '../heading-description/HighlightedHeading';

interface MultiSectionProps {
  data: {
    heading?: Title | undefined;
    description?: string | descriptionType;
    listItems: Array<ListItems>;
  };
}

const MultiSection = ({ data }: MultiSectionProps) => {
  const aboutUsComponents = data?.listItems.map((item, index) => {
    const isOdd = index % 2 === 0;

    // Variants for the container
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.2,
        },
      },
    };

    // Variants for children elements
    const childVariants = {
      hidden: {
        opacity: 0,
        y: 20,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: 'easeOut',
        },
      },
    };

    const imageVariants = {
      hidden: {
        opacity: 0,
        x: isOdd ? 20 : -20,
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.5,
          ease: 'easeOut',
        },
      },
    };

    return (
      <motion.article
        className=" w-auto h-full "
        key={item?.title + index}
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        <div
          className={cn(
            `grid grid-cols-1 lg:grid-cols-2  min-h-[25rem]`,
            !isOdd && 'vertical-stripes',
          )}>
          <motion.header
            className={cn(
              'flex flex-col justify-center items-center text-center m-auto text-green-dark',
              isOdd 
                ? 'lg:order-1 py-16 px-8 md:py-[8rem] md:px-[4rem] max-w-full md:max-w-[80%]' 
                : 'lg:order-2 bg-white rounded-[2rem] shadow-sm border border-green-900/5 h-fit my-12 mx-4 p-10 md:my-[8rem] md:p-[6rem] max-w-[95%] md:max-w-[80%]',
            )}
            variants={childVariants}>
            <HighlightedHeading
              text={data?.heading?.title ?? ''}
              word={data?.heading?.highlightedWord}
              color={data?.heading?.highlightedColor}
              tag="h2"
              className="uppercase text-[3.2rem] md:text-[4.8rem] leading-[1.2] mb-4"
            />

            <p className="text-[1.8rem] md:text-[2.4rem] w-full uppercase text-green-dark/40 font-medium tracking-wider">
              {item?.subTitle}
            </p>

            <PortableTextContainer
              data={item?.description}
              className="mt-6 md:mt-[2rem] text-[1.6rem] leading-[1.6] text-inherit"
            />
            <Link
              href={item?.button?.slug?.current ?? '/'}
              className={cn('w-full mt-8 md:mt-[3rem]')}>
              <Button variant={'ghost'} className="text-[1.4rem] px-8 py-6 uppercase tracking-wider font-semibold hover:bg-green-1/20">
                {item.button?.text}
              </Button>
            </Link>
          </motion.header>

          <motion.figure
            variants={imageVariants}
            className={cn(
              `relative w-full overflow-hidden max-h-[55rem] min-h-[25rem] lg:min-h-[unset] aspect-square md:aspect-auto`,
              isOdd ? ' lg:order-2' : ' lg:order-1',
            )}>
            {item?.image && (
              <Image
                src={urlFor(item.image).url() ?? ''}
                alt={item?.title ?? ''}
                // fill={true}
                width={1200}
                height={600}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 75vw"
                className="object-cover w-full h-full"
              />
            )}
          </motion.figure>
        </div>
      </motion.article>
    );
  });

  return (
    <section className="bg-green-1/10 overflow-hidden">
      <div className="grid max-w-[1920px] border-x-[1px] border-green-5 mx-auto">
        {aboutUsComponents}
      </div>
    </section>
  );
};

export default MultiSection;
