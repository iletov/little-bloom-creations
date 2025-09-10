'use client';
import Image from 'next/image';
import React from 'react';

export const DesignHeader = () => {
  const imageLoader = `https://images.unsplash.com/photo-1519619224615-e691070d7f98?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;

  return (
    <>
      <div className="w-full h-full">
        <Image
          src={imageLoader}
          alt="design-banner"
          className="w-full h-full max-h-[22rem] object-cover"
          // fill
          width={1200}
          height={800}
        />
      </div>
    </>
  );
};
