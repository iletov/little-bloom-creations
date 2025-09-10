'use client';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface VideoProps {
  videoUrl: string;
  thumbnailImage: string;
}

export const VideoComponent = ({ videoUrl, thumbnailImage }: VideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const video_ref = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (video_ref.current) {
      if (isPlaying) {
        video_ref.current.pause();
      } else {
        video_ref.current.play();
        setShowThumbnail(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full h-full aspect-video rounded-lg overflow-hidden bg-black">
      <video
        ref={video_ref}
        src={videoUrl}
        className="w-full h-full object-cover"
        onEnded={() => {
          setIsPlaying(false);
          setShowThumbnail(true);
        }}
        onPlay={() => {
          setShowThumbnail(false);
          setIsPlaying(true);
        }}
        onPause={() => {
          setShowThumbnail(true);
          setIsPlaying(false);
        }}
        playsInline
        controls={!showThumbnail}
      />

      {showThumbnail && thumbnailImage && (
        <button
          className="absolute inset-0 cursor-pointer"
          onClick={handlePlayPause}>
          <div className="relative w-full h-full">
            <Image
              src={urlFor(thumbnailImage).url()}
              alt="thumbnail image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
