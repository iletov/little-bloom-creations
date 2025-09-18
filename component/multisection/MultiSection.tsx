'use client';

import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { motion } from 'framer-motion';
import { descriptionType, ImagesType, ListItems } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MultiSectionProps {
  data: {
    title?: string | undefined;
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
        className=" w-auto h-full "
        key={item?.title + index}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          amount: 0.2,
          once: true,
          // margin: '0px 0px -50px 0px'
        }}>
        <div
          className={cn(
            `grid grid-cols-1 lg:grid-cols-2  min-h-[25rem]`,
            !isOdd && 'vertical-stripes',
          )}>
          <motion.header
            className={cn(
              'flex flex-col justify-center items-center my-[6rem] p-[2rem] text-center max-w-[70%]  m-auto text-green-dark',
              isOdd ? 'lg:order-1' : 'lg:order-2 bg-white border-card h-fit',
            )}
            variants={childVariants}>
            <h2 className="text-[4.8rem] font-semibold uppercase">
              {item?.title}
            </h2>

            <p className="text-[3.2rem] w-full uppercase text-green-dark/40">
              {item?.subTitle}
            </p>

            <PortableTextContainer
              data={item?.description}
              className="mt-[2rem] text-[1.6rem] leading-[1.4] text-inherit"
            />
            <Link
              href={`/categories/${item?.button?.url}`}
              className={cn('w-full   mt-[3rem] ')}>
              <Button variant={'ghost'} className="">
                {item.button?.text}
              </Button>
            </Link>
          </motion.header>

          <motion.figure
            variants={imageVariants}
            className={cn(
              ` 
            relative w-full overflow-hidden max-h-[55rem] min-h-[20rem lg:min-h-[unset]`,
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
    <section className="bg-green-1/10">
      <div className=" grid max-w-[1920px] border-x-[1px] border-green-5 mx-auto">
        {aboutUsComponents}
      </div>
    </section>
  );
};

export default MultiSection;
