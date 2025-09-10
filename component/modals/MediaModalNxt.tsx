'use client';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MediaItem } from '../gallery/BentoGridImgAndVideo';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

interface MediaModalProps {
  mediaItems: MediaItem[];
  currentIndex: number | null;
  onCloseAction: () => void;
  onPreviousAction: () => void;
  onNextAction: () => void;
}

const MediaModalNxt = ({
  mediaItems,
  currentIndex,
  onCloseAction: onClose,
  onPreviousAction: onPrevious,
  onNextAction: onNext,
}: MediaModalProps) => {
  // Your existing state
  const isOpen = currentIndex !== null;
  const currentMedia = currentIndex !== null ? mediaItems[currentIndex] : null;
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const AdjacentImagePreloader = useMemo(() => {
    if (currentIndex === null) return null;

    const adjacentIndexes = [
      currentIndex - 1 >= 0 ? currentIndex - 1 : mediaItems.length - 1,
      currentIndex + 1 < mediaItems.length ? currentIndex + 1 : 0,
    ];

    return adjacentIndexes.map(index => {
      const item = mediaItems[index];
      if (item.type === 'image' && item.src && !loadedImages.has(index)) {
        return (
          <div key={`preload-${index}`} style={{ display: 'none' }}>
            <Image
              src={urlFor(item.src).url() ?? ''}
              alt=""
              width={1920}
              height={1080}
              onLoad={() => {
                setLoadedImages(prev => new Set([...prev, index]));
              }}
              priority={false}
              quality={75}
            />
          </div>
        );
      }
      return null;
    });
  }, [currentIndex, mediaItems, loadedImages]);

  // Combined useEffect for modal management
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'unset';
      return;
    }

    document.body.style.overflow = 'hidden';
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setDirection(-1);
          onPrevious();
          break;
        case 'ArrowRight':
          setDirection(1);
          onNext();
          break;
        case ' ':
          event.preventDefault();
          // if (currentMedia?.type === 'video') {
          //   togglePlayPause();
          // }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, onClose, onPrevious, onNext, currentMedia]);

  // Optimized navigation handlers
  const handlePreviousClick = useCallback(() => {
    setDirection(-1);
    onPrevious();
  }, [onPrevious]);

  const handleNextClick = useCallback(() => {
    setDirection(1);
    onNext();
  }, [onNext]);

  // const togglePlayPause = useCallback(async () => {
  //   if (videoRef.current) {
  //     try {
  //       if (isPlaying) {
  //         videoRef.current.pause();
  //       } else {
  //         await videoRef.current.play();
  //       }
  //       setIsPlaying(!isPlaying);
  //     } catch (error) {
  //       console.error('Error playing video:', error);
  //     }
  //   }
  // }, [isPlaying]);

  // const toggleMute = useCallback(() => {
  //   if (videoRef.current) {
  //     videoRef.current.muted = !isMuted;
  //     setIsMuted(!isMuted);
  //   }
  // }, [isMuted]);

  // Animation variants for framer-motion
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  if (!isOpen || !currentMedia) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Hidden preloader components - these use Next.js Image for optimization */}
        {AdjacentImagePreloader}

        {/* Backdrop */}
        <motion.div
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        />
        {/* <div className="relative z-10 w-full h-full flex items-center justify-center p-4 bg-green-300"> */}
        <div
          className={`relative max-w-[90vw] max-h-[90vh] w-full overflow-hidden ${currentMedia.type === 'image' ? 'min-h-[550px]' : 'h-full'}`}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 320, damping: 30 },
                opacity: { duration: 0.4 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  setDirection(1);
                  onNext();
                } else if (swipe > swipeConfidenceThreshold) {
                  setDirection(-1);
                  onPrevious();
                }
              }}
              className="absolute inset-0 flex items-center justify-center">
              {currentMedia.type === 'image' ? (
                <div className="relative w-full h-full">
                  <Image
                    src={urlFor(currentMedia.src).url() ?? ''}
                    alt={currentMedia.alt ?? ''}
                    fill={true}
                    className="object-contain "
                    priority={true}
                    sizes="100vw"
                    quality={75}
                    onLoad={() => {
                      setLoadedImages(
                        prev => new Set([...prev, currentIndex!]),
                      );
                    }}
                  />
                </div>
              ) : // <video
              //   ref={videoRef}
              //   src={currentMedia.videoUrl?.videoFile?.url}
              //   className="max-w-full max-h-full object-contain"
              //   controls={false}
              //   muted={isMuted}
              //   onPlay={() => setIsPlaying(true)}
              //   onPause={() => setIsPlaying(false)}
              //   onClick={togglePlayPause}
              //   playsInline
              // />
              null}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Media Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4  text-center text-white">
          {/* <h2 className="text-xl font-semibold mb-2">{currentMedia.title}</h2> */}
          <p className="text-sm text-center text-white/70">
            {currentIndex + 1} / {mediaItems.length}
          </p>
        </motion.div>

        {/* Navigation buttons */}
        <Button
          variant="ghost"
          className="absolute top-4 right-4 z-20 w-8 h-8 md:h-14 md:w-14 p-0  hover:bg-white/20 text-white md:[&_svg]:size-12 [&_svg]:stroke-1"
          onClick={onClose}>
          <X />
        </Button>

        {/* Previous Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:h-14 md:w-14 p-0 z-20 hover:bg-white/20 text-white md:[&_svg]:size-16 [&_svg]:stroke-1"
          onClick={handlePreviousClick}>
          <ChevronLeft />
        </Button>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 bottom-[2rem] -translate-y-1/2 w-8 h-8 md:h-14 md:w-14 p-0 z-20 hover:bg-white/20 text-white md:[&_svg]:size-16 [&_svg]:stroke-1"
          onClick={handleNextClick}>
          <ChevronRight className="h-12 w-12" />
        </Button>

        {/* Video controls */}
        {/* {currentMedia.type === 'video' && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={togglePlayPause}>
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={toggleMute}>
              {isMuted ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </Button>
          </div>
        )} */}
        {/* </div> */}
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaModalNxt;
