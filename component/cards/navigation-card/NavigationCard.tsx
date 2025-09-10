'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { RefObject, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { urlFor } from '@/sanity/lib/image';
import { Reference } from 'sanity';
import { Description } from '@/component/text/Description';
import './navigation-card.css';
import LiquidDrop from '@/component/animations/LiquidDrop';

export const NavigationCard = ({
  data,
  index,
  ref,
}: {
  data: any;
  index: number;
  ref: RefObject<HTMLDivElement | null>;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null as number | null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent, index: number) => {
    if (ref.current && hoveredIndex === index) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      mouseX.set(x * 0.3); // Scale down the movement
      mouseY.set(y * 0.3);
    }
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    mouseX.set(0);
    mouseY.set(0);
  };

  const http =
    data?.slug?.current?.startsWith('http://') ||
    data?.slug?.current?.startsWith('https://');

  const getDelay = (index: number) => {
    switch (index) {
      case 0:
        return 0.4; // Second element (index 1) appears first
      case 1:
        return 0.6; // Third element (index 2) appears second
      case 2:
        return 0.7; // First element (index 0) appears third
      case 3:
        return 0.5; // Fourth element (index 3) appears last
      default:
        return 0;
    }
  };

  const itemVariants = {
    hidden: (index: number) => ({
      opacity: 0,
      y: 30, // Start from top
      transition: {
        delay: getDelay(index),
        duration: 0.35,
        // delay: Math.abs(index - (dataLength - 1) / 2) * 0.1,
      },
    }),
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        // delay: Math.abs(index - (dataLength - 1) / 2) * 0.1,
        delay: getDelay(index),
        duration: 0.35,
        // type: 'spring',
        stiffness: 8,
        // damping: 1,
      },
    }),
  };

  return (
    <>
      <Link
        href={http ? data.slug?.current : `/${data.slug?.current}`}
        target={http ? '_blank' : '_self'}
        // href={currentSlug(data.slug?.current || '')}
        className="w-fit xl:w-fit text-foreground ">
        <motion.div
          variants={itemVariants}
          custom={index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseMove={e => handleMouseMove(e, index)}
          onMouseLeave={handleMouseLeave}
          className={`
          
          relative
          text-slate-800
          flex flex-col
          gap-2 items-center
          justify-center
          `}>
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="relative nav-card min-w-[85px] min-h-[85px]  ">
            <Image
              src={urlFor(data.images?.asset as Reference).url()}
              alt={data.title || ''}
              fill
              sizes="(max-width: 768px) 50vw"
              className="w-full h-full object-cover rounded-full"
              priority
            />
            {hoveredIndex === index && <LiquidDrop />}
          </motion.div>
          <div>
            <Description
              data={data.title}
              className="text-left text-[0.775rem] md:text-[1.3rem]"
            />
          </div>
        </motion.div>
      </Link>
    </>
  );
};
