'use client';
import React, { useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { NavigationCard } from '../navigation-card/NavigationCard';
import { Heading } from '@/component/text/Heading';
import { IconsCardsProps } from '../IconsCards';

const NavigationWrapper = ({ data }: IconsCardsProps) => {
  const navWrapper_ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(navWrapper_ref, { once: true, amount: 1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 1.25, // Equal delay between each child
      },
    },
  };

  return (
    <section className=" xl:max-w-5xl xl:mx-auto xl:px-6 py-3 space-y-3">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'linear' }}
        className="space-y-2">
        <Heading
          data={data?.sectionTitle}
          className="glossy-text-section text-[1.25rem] md:text-[2rem]"
        />
      </motion.header>
      <motion.div
        ref={navWrapper_ref}
        initial={'hidden'}
        animate={isInView ? 'show' : 'hidden'}
        // whileInView={'show'}
        variants={containerVariants}
        // viewport={{ once: true }}
        // className=" w-full grid grid-cols-3 md:justify-center gap-2">
        className=" w-fit mx-auto  grid grid-cols-2 justify-items-center md:flex gap-x-16 gap-y-4 md:gap-x-8 md:gap-y-8">
        {data?.cards?.map((item, index: number) => (
          <NavigationCard
            data={item as any}
            key={index}
            index={index}
            ref={navWrapper_ref}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default NavigationWrapper;
