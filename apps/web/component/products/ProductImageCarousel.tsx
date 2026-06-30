'use client';
import React from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ProductImageCarouselProps {
  images: any[];
  alt: string;
}

export const ProductImageCarousel = ({ images, alt }: ProductImageCarouselProps) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="w-full relative group">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <div className="rounded-[2rem] overflow-hidden bg-[#f4f4f6]">
          <CarouselContent className="ml-0">
            {images.map((img: any, index: number) => (
              <CarouselItem key={img?._key || index} className="pl-0 basis-full">
                <div className="aspect-square lg:aspect-auto lg:h-[73vh] lg:max-h-[650px] w-full relative">
                  <Image
                    src={urlFor(img).width(1200).height(1200).url()}
                    alt={img?.alt ?? `${alt} - изображение ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
        {images.length > 1 && (
          <div className="flex items-center justify-end gap-4 mt-6">
            <CarouselPrevious className="static translate-y-0 translate-x-0 h-14 w-14 border-transparent bg-white text-[#334455] shadow-none hover:bg-white hover:text-[#334455] opacity-100 disabled:opacity-50 [&>svg]:w-6 [&>svg]:h-6" />
            <CarouselNext className="static translate-y-0 translate-x-0 h-14 w-14 border-transparent bg-white text-[#334455] shadow-none hover:bg-white hover:text-[#334455] opacity-100 disabled:opacity-50 [&>svg]:w-6 [&>svg]:h-6" />
          </div>
        )}
      </Carousel>
    </div>
  );
};
