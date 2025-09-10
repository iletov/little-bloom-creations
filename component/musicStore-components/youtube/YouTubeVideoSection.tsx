'use client';
import { Heading } from '@/component/text/Heading';
import React, { useState, useTransition } from 'react';
import { YouTubeChanel } from './YouTubeChanel';
import { toast } from 'sonner';
import { loadMoreVideos } from '@/actions/loadMoreVideos';
import { Button } from '@/components/ui/button';
import { Loader } from '@/component/loader/Loader';
import Skeleton from '@/component/gallery/Skeleton';

const YouTubeVideoSection = ({
  data,
  heading,
}: {
  data: any;
  heading?: string;
}) => {
  const videosData = {
    data: data?.videos?.videos,
    totalVideos: data?.totalVideos,
  };

  const [videos, setVideos] = useState<any[]>(videosData?.data);
  const [page, setPage] = useState(data?.currentPage ?? 1);
  const [hasMore, setHasMore] = useState(data?.hasNextPage);
  const [isPending, startTransition] = useTransition();

  const handleLoadMoreVideos = () => {
    if (isPending || !hasMore) return;

    const nextPage = page + 1;

    startTransition(async () => {
      try {
        const result = await loadMoreVideos(data?.videoCategories, nextPage);

        if (result?.success && result?.videos?.length > 0) {
          setVideos(prevVideos => [...prevVideos, ...result.videos]);
          setPage(nextPage);
          setHasMore(result.hasNextPage);
        } else {
          toast?.error('Възникна грешка при зареждането...');
        }
      } catch (error) {
        console.error('Error loading more images:', error);
        toast?.error('Възникна грешка при зареждането...');
      }
    });
  };

  if (!videos?.length || !videos) return <Skeleton />;

  return (
    <section className="section_wrapper_xl">
      {heading ? (
        <Heading
          data={heading ?? ''}
          className=" heading2 mb-8 md:mb-12 flex-wrap max-w-[90%] mx-auto"
        />
      ) : null}
      {videos && videos.length > 0 ? (
        <div className="grid-container">
          {videos?.map((track: any, index: number) => (
            <YouTubeChanel
              key={index + track?.url}
              video={track?.url}
              index={index}
            />
          ))}
        </div>
      ) : (
        <Skeleton />
      )}
      {/* Load More button */}
      {videos.length < videosData?.totalVideos ? (
        <div className="w-full flex justify-center ">
          <Button
            variant="ghost"
            className="border-[2px] border-white px-8 py-5 shadow-lg"
            onClick={handleLoadMoreVideos}>
            {isPending ? <Loader /> : 'Виж повече'}
          </Button>
        </div>
      ) : null}
    </section>
  );
};

export default YouTubeVideoSection;
