'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import { cn } from '@/lib/utils';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';

type VideoTestimonialCardProps = {
  item: any;
  activeVideo: string | null;
  setActiveVideo: (key: string | null) => void;
};

export const VideoTestimonialCard = ({
  item,
  activeVideo,
  setActiveVideo,
}: VideoTestimonialCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlaying = activeVideo === item._key;

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.muted = false;
        videoRef.current.currentTime = 0; // restart from beginning when clicked
        videoRef.current.play().catch(e => console.error('Error playing video:', e));
      } else {
        videoRef.current.muted = true;
        // Do not pause or reset time when not playing, just let it run silently in the background
      }
    }
  }, [isPlaying]);

  // Handle click outside to stop
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isPlaying && !target.closest('.video-testimonial-container')) {
        setActiveVideo(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPlaying, setActiveVideo]);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      setActiveVideo(null);
    } else {
      setActiveVideo(item._key);
    }
  };

  const product = item.product;
  const productHref = product ? `/categories/${product.category?.slug?.current || 'all'}/${product.slug?.current}` : '#';

  return (
    <div 
      className={cn(
        "video-testimonial-container relative w-full rounded-[2rem] shadow-sm cursor-pointer transition-transform duration-300",
        // The container no longer has overflow-hidden, so the absolute banner can stick out
        "mb-12" // Add margin bottom to account for the overlapping banner
      )}
      onClick={handleVideoClick}
    >
      {/* Video Container */}
      <div className="relative w-full aspect-[9/16] min-h-[450px] rounded-[2rem] overflow-hidden bg-black shadow-lg">
        <video
          ref={videoRef}
          src={item.video?.asset?.url}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted={true} // start muted in the background
          playsInline
        />

        {/* Overlay - hides when playing */}
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-300 flex flex-col items-center justify-center",
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100 bg-black/40"
          )}
        >
          <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110 drop-shadow-2xl">
            <Play className="w-20 h-20 text-white opacity-90 drop-shadow-lg filter" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content (if any) overlaid on the video */}
        {(item.subTitle || item.description) && !isPlaying && (
          <div className="absolute inset-x-0 top-0 p-8 pt-12 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
            {item.subTitle && (
              <h4 className="text-white font-semibold text-[2rem] leading-tight mb-2">
                {item.subTitle}
              </h4>
            )}
            {item.description && (
              <div className="text-white/90 text-[1.4rem]">
                <PortableTextContainer data={item.description} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Reference Card - Overlapping at the bottom */}
      {product && (
        <div 
          className="absolute -bottom-8 left-6 right-6 z-10"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Link 
            href={productHref}
            className="flex items-center gap-4 p-3 bg-gradient-to-r from-[#fdfdff] to-[#f0efff] rounded-[1.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/60"
          >
            {/* Product Image */}
            <div className="relative w-[4.5rem] h-[4.5rem] rounded-xl overflow-hidden bg-white shrink-0 shadow-sm">
              {product.images?.[0] ? (
                <Image
                  src={urlFor(product.images[0]).url()}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[0.8rem] text-slate-400 text-center">
                  Няма
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col justify-center flex-1 pr-2">
              <span className="text-[#0a2540] font-bold text-[1.3rem] leading-tight line-clamp-1">
                {product.name}
              </span>
              <span className="text-slate-500 text-[1.1rem] mt-0.5">
                {product.category?.name || 'Виж продукта'}
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};
