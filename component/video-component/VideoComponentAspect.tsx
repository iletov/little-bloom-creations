import { useState, useRef, useEffect } from 'react';

type VideoProps = {
  videoUrl: string;
  aspectRatio?: string; // Optional aspect ratio override (e.g. "16/9", "4/3")
};

export const VideoComponentAspect = ({ videoUrl, aspectRatio }: VideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState(
    aspectRatio || '16/9',
  );

  const thumbnailRef = useRef<HTMLVideoElement>(null);
  const overlayVideoRef = useRef<HTMLVideoElement>(null);

  // Combined useEffect for multiple overlay-related behaviors
  useEffect(() => {
    // 1. Handle video metadata loading for aspect ratio
    const handleMetadataLoad = () => {
      if (thumbnailRef.current && !aspectRatio) {
        const video = thumbnailRef.current;
        const calculatedRatio = `${video.videoWidth}/${video.videoHeight}`;
        // setVideoAspectRatio(calculatedRatio);
        setIsVideoLoaded(true);
      }
    };

    if (thumbnailRef.current) {
      thumbnailRef.current.addEventListener(
        'loadedmetadata',
        handleMetadataLoad,
      );
    }

    // 2. Handle ESC key to close overlay
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showOverlay) {
        closeOverlay();
      }
    };

    // 3. Handle body scroll lock when overlay is open
    if (showOverlay) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscKey);

      // 4. Auto-play when overlay opens
      if (overlayVideoRef.current && thumbnailRef.current) {
        overlayVideoRef.current.currentTime =
          thumbnailRef.current.currentTime || 0;

        overlayVideoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setShowControls(true);
          })
          .catch(error => {
            console.error('Error auto-playing video:', error);
          });
      }
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscKey);
    }

    // Cleanup function
    return () => {
      if (thumbnailRef.current) {
        thumbnailRef.current.removeEventListener(
          'loadedmetadata',
          handleMetadataLoad,
        );
      }
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [videoUrl, aspectRatio, showOverlay]);

  const handleThumbnailClick = () => {
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    if (overlayVideoRef.current) {
      overlayVideoRef.current.pause();
    }
    setIsPlaying(false);
    setShowOverlay(false);
  };

  const handlePlayPause = () => {
    const activeVideo = overlayVideoRef.current;

    if (activeVideo) {
      if (isPlaying) {
        activeVideo.pause();
      } else {
        activeVideo
          .play()
          .then(() => {
            setShowControls(true);
          })
          .catch(error => {
            console.error('Error playing video:', error);
          });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* Thumbnail view (160px wide) */}
      <div
        className="relative w-full h-full cursor-pointer"
        // style={{ aspectRatio: videoAspectRatio }}
        onClick={handleThumbnailClick}>
        <video
          ref={thumbnailRef}
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          preload="metadata"
          muted
          playsInline
          disablePictureInPicture
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Full-screen overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all z-10"
            onClick={closeOverlay}
            aria-label="Close video">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Video container */}
          <div
            className="relative w-full max-w-5xl max-h-screen p-4"
            style={{ aspectRatio: videoAspectRatio }}>
            <video
              ref={overlayVideoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              onEnded={() => {
                setIsPlaying(false);
                setShowControls(false);
              }}
              onPlay={() => {
                setIsPlaying(true);
                setShowControls(true);
              }}
              onPause={() => {
                setIsPlaying(false);
              }}
              playsInline
              controls
              preload="auto"
            />

            {!isPlaying && (
              <button
                className="absolute inset-0 w-full h-full cursor-pointer"
                onClick={handlePlayPause}
                aria-label="Play video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
