'use client';
import React from 'react';
import { motion } from 'framer-motion';

const LiquidDrop = () => {
  return (
    <motion.div
      className="absolute inset-0 rounded-full border-2 border-white/30"
      initial={{
        scale: 1,
        opacity: 0.8,
      }}
      animate={{
        scale: 1.8,
        opacity: 0,
      }}
      transition={{
        duration: 1.2,
        ease: 'easeOut',
      }}
    />
  );
};

export default LiquidDrop;
