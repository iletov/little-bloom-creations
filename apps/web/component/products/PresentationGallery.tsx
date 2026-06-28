import React from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { cn } from '@/lib/utils';

interface PresentationGalleryProps {
  images?: any[];
}

export const PresentationGallery = ({ images }: PresentationGalleryProps) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="py-8">
      {/* Mobile view: simple 1-col or 2-col layout */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {images.map((img, index) => (
          <div
            key={img?._key || index}
            className={cn(
              "relative overflow-hidden rounded-xl bg-gray-100",
              index === 0 ? "col-span-2 aspect-square" : "col-span-1 aspect-[4/5]"
            )}
          >
            <Image
              src={urlFor(img).width(800).height(800).url()}
              alt={img?.alt ?? `Gallery image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Desktop view: 6-column grid for precise layout */}
      <div className="hidden md:grid grid-cols-6 gap-4 auto-rows-[100px]">
        {images.map((img, index) => {
          let containerClass = "relative overflow-hidden rounded-xl bg-gray-100 transition-transform duration-300 shadow-sm ";
          
          if (index === 0) {
            // Image 1: Full width (6 cols, 4 rows)
            containerClass += "col-span-6 row-span-4 lg:row-span-5";
          } else if (index === 1 || index === 2) {
            // Image 2 & 3: Half width (3 cols, 3 rows)
            containerClass += "col-span-3 row-span-3";
          } else if (index === 3 || index === 4) {
            // Image 4 & 5: Vertical (3 cols, 4 rows or 5 rows for extra verticality)
            containerClass += "col-span-3 row-span-5";
          } else {
            // Fallback for > 5 images
            containerClass += "col-span-2 row-span-2";
          }

          return (
            <div key={img?._key || index} className={containerClass}>
              <Image
                src={urlFor(img).width(1200).height(1200).url()}
                alt={img?.alt ?? `Gallery image ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
