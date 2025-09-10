'use client';
import React from 'react';
import { motion } from 'framer-motion';

const Track = ({ track, index }: { track: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.2 }}
      className="w-full rounded-[12px] overflow-hidden min-w-[250px lg:min-w-[300px] max-h-[220px]">
      <iframe
        width="100%"
        height="100%"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track}&show_user=true&show_artwork=false&show_teaser=false&visual=true&buying=true}&color=00FF00;`}></iframe>
    </motion.div>
  );
};

export default Track;
