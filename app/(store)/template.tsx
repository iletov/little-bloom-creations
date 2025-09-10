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

  const opacity: Variants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 1 },
  };

  // const slide: Variants = {
  //   initial: { top: '100vh' },
  //   enter: { top: '100vh' },
  //   exit: { top: '0', transition: { duration: 0.8, ease: 'easeInOut' } },
  // };

  // const slide: Variants = {
  //   initial: { y: '100vh' },
  //   enter: { y: '95vh' },
  //   exit: { y: '10vh', transition: { duration: 1 } },
  // };

  return (
    <>
      <motion.div {...anim(opacity)}>{children}</motion.div>
    </>
  );
}
