'use client';
import React from 'react';
import { motion } from 'framer-motion';

type chanelProps = {
  video: string;
  index: number;
};
export const YouTubeChanel = ({ video, index }: chanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.2 }}
      className="w-full h-full rounded-[12px] overflow-hidden aspect-video sm:min-w-[280px] lg:max-w-[400px] max-h-[322px]">
      <iframe
        width="100%"
        height="100%"
        src={`${video}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen={true}></iframe>
    </motion.div>
  );
};
