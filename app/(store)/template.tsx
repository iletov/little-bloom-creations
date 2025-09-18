'use client';
import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  const anim = (variants: Variants) => {
    return {
      initial: 'initial',
      animate: 'enter',
      exit: 'exit',
      variants,
    };
  };

  const slide: Variants = {
    initial: { opacity: 0.5 },
    enter: {
      // y: 0,
      opacity: 1,
      transition: {
        // y: {
        //   type: 'tween',
        //   stiffness: 300,
        //   damping: 25,
        //   duration: 0.8,
        // },
        opacity: {
          type: 'tween',
          ease: 'easeOut',
          duration: 0.2,
        },
      },
    },
  };

  return (
    <>
      <motion.div {...anim(slide)}>{children}</motion.div>
    </>
  );
}
