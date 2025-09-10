import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Heading } from '@/component/text/Heading';

export const SoundCloudSlider = ({
  data,
  heading,
}: {
  data: any;
  heading: string;
}) => {
  return (
    <section className="pt-[1.75rem] pb-8">
      <Heading
        data={heading || 'Слушайте в SoundCloud'}
        className="heading2 mb-8 md:mb-12"
      />
      <div className="hidden lg:block section_wrapper ">
        <Carousel opts={{ align: 'start', loop: true, slidesToScroll: 3 }}>
          <CarouselContent className="-ml-0">
            {data?.map((track: any, index: number) => (
              <CarouselItem
                className="basis-[70%] md:basis-1/3 lg:basis-1/4 "
                key={index + track?.trackId}>
                <Track track={track?.trackId} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant={'default'}
            className="rounded-lg right-3 bg-secondaryPurple/40 hover:bg-secondaryPurple/60"
          />
          <CarouselNext
            variant={'default'}
            className="rounded-lg bg-secondaryPurple/40 hover:bg-secondaryPurple/60"
          />
        </Carousel>
      </div>

      <div className="flex lg:hidden overflow-x-scroll pb-4">
        {data?.map((track: any, index: number) => (
          <Track track={track?.trackId} key={track?.trackId + index} />
        ))}
      </div>
    </section>
  );
};

const Track = ({ track }: any) => {
  return (
    <section className="w-full rounded-[12px] overflow-hidden min-w-[280px] lg:min-w-[300px] max-h-[220px] pl-4 md:pl-0">
      <iframe
        width="100%"
        height="100%"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track}&show_user=true&show_artwork=false&show_teaser=false&visual=true&buying=true}&color=00FF00;`}></iframe>
    </section>
  );
};
