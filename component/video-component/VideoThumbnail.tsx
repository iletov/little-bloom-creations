'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface VideoThumbnailProps {
  videoSrc: string;
  alt: string;
  className?: string;
}

export function VideoThumbnail({
  videoSrc,
  alt,
  className,
}: VideoThumbnailProps) {
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const generateThumbnail = () => {
      const video = videoRef.current;
      if (!video) return;

      const handleLoadedMetadata = () => {
        // Wait a bit more for the video to be ready
        setTimeout(() => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              setError(true);
              setIsLoading(false);
              return;
            }

            // Set canvas size to video dimensions
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;

            // Draw the current frame
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to blob and create object URL for better performance
            canvas.toBlob(
              blob => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  setThumbnailSrc(url);
                } else {
                  setError(true);
                }
                setIsLoading(false);
              },
              'image/jpeg',
              0.8,
            );
          } catch (err) {
            console.error('Error generating thumbnail:', err);
            setError(true);
            setIsLoading(false);
          }
        }, 100);
      };

      const handleError = (e: Event) => {
        console.error('Video loading error:', e);
        setError(true);
        setIsLoading(false);
      };

      const handleCanPlay = () => {
        // Seek to a frame that's likely to have content
        video.currentTime = Math.min(1, video.duration * 0.1);
      };

      const handleSeeked = () => {
        handleLoadedMetadata();
      };

      video.addEventListener('loadedmetadata', handleCanPlay);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('seeked', handleSeeked);
      video.addEventListener('error', handleError);

      // Set video properties
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.src = videoSrc;

      return () => {
        video.removeEventListener('loadedmetadata', handleCanPlay);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('seeked', handleSeeked);
        video.removeEventListener('error', handleError);

        // Clean up object URL
        if (thumbnailSrc && thumbnailSrc.startsWith('blob:')) {
          URL.revokeObjectURL(thumbnailSrc);
        }
      };
    };

    generateThumbnail();
  }, [videoSrc]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (thumbnailSrc && thumbnailSrc.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailSrc);
      }
    };
  }, [thumbnailSrc]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 w-full h-full ${className}`}>
        <div className="text-center text-gray-500">
          <p className="text-sm">Video thumbnail unavailable</p>
        </div>
      </div>
    );
  }

  if (isLoading || !thumbnailSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 w-full h-full ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <video
          ref={videoRef}
          className="hidden"
          muted
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <>
      <img
        src={thumbnailSrc || '/placeholder.svg'}
        alt={alt}
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <video ref={videoRef} className="hidden" />
    </>
  );
}
