import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { descriptionType, ImagesType, ListItems, Title } from '@/types';
import React from 'react';
import VerticalLine from '../separator/VerticalLine';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { QuotesIcon, QuotesIcon2 } from '../icons/icons';
import HighlightedHeading from '../heading-description/HighlightedHeading';

type TestimonialsProps = {
  data: {
    heading: Title;
    description?: descriptionType;
    listItems: Array<ListItems>;
  };
};

export default function Testimonials({ data }: TestimonialsProps) {
  return (
    <section className="w-full bg-pink-1 section-y-padding !pb-[10rem] space-y-[2rem] relative min-h-[75vh] flex flex-col justify-center">
      <QuotesIcon2 className="absolute top-[1rem] left-[4rem] w-[26rem] h-[26rem] opacity-10" />
      <header className="grid justify-items-center">
        <HighlightedHeading
          text={data?.heading?.title}
          word={data?.heading?.highlightedWord}
          color={data?.heading?.highlightedColor}
          tag="h2"
        />
        <PortableTextContainer
          data={data?.description}
          className="text-[1.8rem]"
        />
      </header>
      <Carousel className="w-full section_wrapper h-full ">
        <CarouselContent className="-ml-4 md:-ml-8 py-8">
          {data?.listItems?.map((item, index) => (
            <CarouselItem
              key={index}
              className="basis-full md:basis-1/2 xl:basis-[45%] pl-4 md:pl-8 text-green-dark">
              <div className="rounded-[2rem] border-card bg-white/50 backdrop-blur-sm shadow-lg text-center gap-[2rem] p-[3rem] sm:p-[4rem] lg:p-[5rem] flex flex-col justify-between h-full transform transition-all duration-500 hover:border-pink-9">
                
                <div className="space-y-6 flex-1 flex flex-col justify-center">
                  <h3 className="text-[2.8rem] md:text-[3.6rem] lg:text-[4.2rem] leading-[1.3] font-semibold text-green-dark">
                    "{item?.title}"
                  </h3>
                  
                  <div className="w-[15%] h-[2px] bg-green-5/50 mx-auto" />
                  
                  <em className="text-[1.8rem] md:text-[2rem] lg:text-[2.2rem] leading-[1.6] text-slate-700 block px-4">
                    <PortableTextContainer data={item?.description} />
                  </em>
                </div>

                <div className="pt-8 mt-auto">
                  <p className="font-monsieurLa text-[3rem] md:text-[4rem] text-green-9 opacity-80">
                    {item?.subTitle}
                  </p>
                </div>
                
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="hidden md:flex h-[4.5rem] w-[4.5rem] bg-green-5 [&_svg]:size-8"
          variant={'default'}
        />
        <CarouselNext
          className="hidden md:flex h-[4.5rem] w-[4.5rem] bg-green-5 [&_svg]:size-8"
          variant={'default'}
        />
      </Carousel>
    </section>
  );
}
