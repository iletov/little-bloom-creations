'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface VideoComponentBigProps {
  videoUrl: string;
  thumbnailImage?: string;
}

export const VideoComponentBig = ({ videoUrl }: VideoComponentBigProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const video_ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = video_ref.current;
    if (video) {
      // Set video to first frame for thumbnail
      video.currentTime = 0.1;
    }
  }, [videoUrl]);

  const handlePlayPause = async () => {
    if (video_ref.current && canPlay) {
      setIsLoading(true);
      try {
        if (isPlaying) {
          video_ref.current.pause();
          setIsPlaying(false);
          setShowControls(false);
        } else {
          await video_ref.current.play();
          setIsPlaying(true);
          setShowControls(true);
        }
      } catch (error) {
        console.error('Error playing video:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowControls(false);
    // Reset to first frame for thumbnail
    if (video_ref.current) {
      video_ref.current.currentTime = 0.1;
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    setShowControls(true);
    setIsLoading(false);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    setShowControls(false);
  };

  const handleCanPlay = () => {
    setCanPlay(true);
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setCanPlay(false);
  };

  const handleLoadedMetadata = () => {
    // Seek to a frame that's likely to have content (0.1 seconds in)
    if (video_ref.current) {
      video_ref.current.currentTime = 0.1;
    }
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black group">
      <video
        ref={video_ref}
        src={videoUrl}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnd}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onLoadedMetadata={handleLoadedMetadata}
        playsInline
        preload="metadata"
        controls={showControls}
        muted={!isPlaying} // Mute when not playing to avoid autoplay issues
      />

      {/* Play button overlay - only show when not playing */}
      {!isPlaying && (
        <button
          className="absolute inset-0 cursor-pointer flex items-center justify-center"
          onClick={handlePlayPause}
          disabled={isLoading || !canPlay}>
          <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-70 group-hover:scale-110">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-8 h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </button>
      )}

      {/* Video badge */}
      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
        ВИДЕО
      </div>

      {/* Loading overlay */}
      {isLoading && !isPlaying && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
