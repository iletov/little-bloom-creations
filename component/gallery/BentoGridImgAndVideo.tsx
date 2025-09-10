'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState, useTransition } from 'react';
import { BentoGridGalleryProps } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { motion } from 'motion/react';
// import { Play } from 'lucide-react';
// import { VideoThumbnail } from '../video-component/VideoThumbnail';
import MediaModalNxt from '../modals/MediaModalNxt';
import { useRouter } from 'next/navigation';
import { loadMoreImages } from '@/actions/loadMoreImages';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader } from '../loader/Loader';

export interface MediaItem {
  id?: string;
  type?: 'image' | 'video';
  src?: any;
  videoUrl?: any;
  thumbnailImage?: string;
  alt?: string;
}

export const BentoGridGalleryImgAndVideo = ({
  data,
  styles,
}: BentoGridGalleryProps) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null,
  );

  const mediaItems: MediaItem[] = [];

  if (data?.images) {
    data?.images?.forEach((image, index) => {
      mediaItems.push({
        id: `image-${index}`,
        alt: 'bento grid image',
        type: 'image',
        src: image ?? '',
      });
    });
  }

  const [images, setImages] = useState(mediaItems);
  const [page, setPage] = useState(data?.currentPage ?? 1);
  const [hasMore, setHasMore] = useState(data?.hasNextPage);
  const [isPending, startTransition] = useTransition();

  const handleLoadMoreImage = () => {
    if (isPending || !hasMore) return;

    const nextPage = page + 1;

    startTransition(async () => {
      try {
        if (data?.slug) {
          //update without page reload
          // router.push(`${data?.slug}?page=${nextPage}`, {
          //   scroll: false,
          // });
          // call server action
          const result = await loadMoreImages(data?.slug.toString(), nextPage);

          if (result?.success && result?.images?.length > 0) {
            setImages(prevImages => [
              ...prevImages,
              ...result.images.map((image, index) => ({
                id: `image-${index}-${nextPage}`,
                alt: 'bento grid image',
                type: 'image' as 'image',
                src: image ?? '',
              })),
            ]);
            setPage(nextPage);
            setHasMore(result.hasNextPage);
          } else {
            toast.error('Възникна грешка при зареждането');
          }
        } else {
          console.error('Slug is undefined');
          toast?.error('Възникна грешка при зареждането...');
        }
      } catch (error) {
        console.error('Error loading more images:', error);
        toast?.error('Възникна грешка при зареждането...');
      }
    });
  };

  const handleMediaClick = (index: number) => {
    setSelectedMediaIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedMediaIndex(null);
  };

  const handlePrevious = () => {
    if (selectedMediaIndex !== null) {
      setSelectedMediaIndex(
        selectedMediaIndex === 0 ? images.length - 1 : selectedMediaIndex - 1,
      );
    }
  };

  const handleNext = () => {
    if (selectedMediaIndex !== null) {
      setSelectedMediaIndex(
        selectedMediaIndex === images.length - 1 ? 0 : selectedMediaIndex + 1,
      );
    }
  };

  if (images.length === 0) {
    return (
      <div className=" mx-auto p-4">
        <div className="text-center py-12">
          <p className="text-foreground/40 font-montserrat text-lg">
            Няма налични снимки
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
      className="mx-auto p-4">
      <div className="bento-grid">
        {images.map((item, index) => (
          <motion.div
            key={item.id}
            className={`bento-item bento-item-${(index % 6) + 1} group cursor-pointer`}
            // whileHover={{ scale: 1.01 }}
            // whileTap={{ scale: 0.98 }}
            onClick={() => handleMediaClick(index)}>
            {item.type === 'image' ? (
              <Image
                src={urlFor(item?.src).url() ?? ''}
                alt={item.alt ?? ''}
                fill
                className="object-cover transition-transform duration-500 "
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 100vw"
              />
            ) : null}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* <h3 className="text-white font-medium text-sm">{item.title}</h3>
              <p className="text-white/70 text-xs capitalize">{item.type}</p> */}
            </div>
          </motion.div>
        ))}
      </div>
      {/* Load More button */}
      {data && data.totalImages && images.length < data.totalImages ? (
        <div className="w-full flex justify-center mt-8">
          <Button
            variant="ghost"
            onClick={handleLoadMoreImage}
            className="border-[2px] border-white px-8 py-5 shadow-lg">
            {isPending ? <Loader /> : 'Виж повече'}
          </Button>
        </div>
      ) : null}

      <MediaModalNxt
        mediaItems={images}
        currentIndex={selectedMediaIndex}
        onCloseAction={handleCloseModal}
        onPreviousAction={handlePrevious}
        onNextAction={handleNext}
      />
    </motion.div>
  );
};
