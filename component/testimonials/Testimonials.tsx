import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { descriptionType, ImagesType, ListItems } from '@/types';
import React from 'react';
import VerticalLine from '../separator/VerticalLine';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { QuotesIcon, QuotesIcon2 } from '../icons/icons';

type TestimonialsProps = {
  data: {
    title: string;
    description?: descriptionType;
    listItems: Array<ListItems>;
  };
};

export default function Testimonials({ data }: TestimonialsProps) {
  return (
    <section className="w-full bg-pink-1 section-y-padding !pb-[10rem] space-y-[2rem] relative">
      <QuotesIcon2 className="absolute top-[1rem] left-[4rem] w-[26rem] h-[26rem] opacity-10" />
      <header className="grid justify-items-center">
        <h2 className="text-[4rem]">{data?.title}</h2>
        <PortableTextContainer
          data={data?.description}
          className="text-[1.8rem]"
        />
      </header>
      <Carousel className="w-full section_wrapper h-full ">
        <CarouselContent className="-ml-8">
          {data?.listItems?.map((item, index) => (
            <CarouselItem
              key={index}
              className=" basis-1/3 pl-8 text-green-dark">
              <div className="rounded-[1.6rem] border-card text-center gap-[1.5rem] p-[2rem] grid grid-rows-[auto_auto_1fr] h-full">
                <h3 className="text-[3.2rem] leading-[1.4] font-semibold ">
                  "{item?.title}"
                </h3>
                <div className="w-[10%] h-px bg-green-5 mx-auto" />
                <em className="text-[1.6rem]  leading-[1.5] ">
                  <PortableTextContainer data={item?.description} />
                </em>
                <p className="font-monsieurLa text-[2.2rem]">
                  {item?.subTitle}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="h-[4.5rem] w-[4.5rem] bg-green-5 [&_svg]:size-8"
          variant={'default'}
        />
        <CarouselNext
          className="h-[4.5rem] w-[4.5rem] bg-green-5 [&_svg]:size-8"
          variant={'default'}
        />
      </Carousel>
    </section>
  );
}
