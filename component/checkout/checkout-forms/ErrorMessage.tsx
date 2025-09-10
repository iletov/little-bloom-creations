'use client';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const ErrorMessage = ({ message }: { message: string | undefined }) => {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-red-500 text-sm mt-1 w-full">
      {message}
    </motion.p>
  );
};
