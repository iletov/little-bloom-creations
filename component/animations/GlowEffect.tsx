'use client';
import React from 'react';
import { motion } from 'framer-motion';

const GlowEffect = () => {
  return (
    <motion.div
      className="absolute inset-0 rounded-full blur-xl opacity-20 pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #D4A017 0%, #D4A017 100%)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1.3, opacity: 0.2 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    />
  );
};

export default GlowEffect;
