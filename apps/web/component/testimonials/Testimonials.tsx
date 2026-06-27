'use client';
import { descriptionType, ListItems, Title } from '@/types';
import React, { useState } from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { QuotesIcon2 } from '../icons/icons';
import HighlightedHeading from '../heading-description/HighlightedHeading';
import { VideoTestimonialCard } from './VideoTestimonialCard';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

type TestimonialsProps = {
  data: {
    heading: Title;
    description?: descriptionType;
    listItems: Array<ListItems>;
  };
};

export default function Testimonials({ data }: TestimonialsProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (!data?.listItems || data.listItems.length === 0) return null;

  // Distribute items into columns based on capacity
  // A column holds exactly 3 units: Text = 1 unit, Video = 2 units
  const columns: ListItems[][] = [];
  let currentColumn: ListItems[] = [];
  let currentCapacity = 0;

  data.listItems.forEach((item) => {
    const isVideo = !!item.video?.asset?.url;
    const cost = isVideo ? 2 : 1;
    
    // If adding this item exceeds the column capacity of 3, 
    // push the current column and start a new one
    if (currentCapacity + cost > 3) {
      if (currentColumn.length > 0) columns.push(currentColumn);
      currentColumn = [item];
      currentCapacity = cost;
    } else {
      currentColumn.push(item);
      currentCapacity += cost;
    }
  });
  
  if (currentColumn.length > 0) {
    columns.push(currentColumn);
  }

  return (
    <section className="w-full bg-gradient-to-b from-[#f8f9ff] to-[#f4f5f9] section-y-padding !pb-[10rem] space-y-[4rem] relative min-h-[75vh] flex flex-col justify-center overflow-hidden">
      <QuotesIcon2 className="absolute top-[1rem] left-[4rem] w-[26rem] h-[26rem] text-slate-300 opacity-20 pointer-events-none" />
      
      <header className="grid justify-items-center mb-12 relative z-10">
        <HighlightedHeading
          text={data?.heading?.title}
          word={data?.heading?.highlightedWord}
          color={data?.heading?.highlightedColor}
          tag="h2"
        />
        <PortableTextContainer
          data={data?.description}
          className="text-[1.8rem] text-center max-w-[80rem]"
        />
      </header>

      <div className="w-full section_wrapper relative z-10 max-w-[1600px] mx-auto">
        {/* CSS Grid of Flex Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 items-start justify-center">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-6 lg:gap-10 w-full h-full">
              {col.map((item, index) => {
                const hasVideo = !!item.video?.asset?.url;

                if (hasVideo) {
                  return (
                    <VideoTestimonialCard 
                      key={item._key || index}
                      item={item} 
                      activeVideo={activeVideo} 
                      setActiveVideo={setActiveVideo} 
                    />
                  );
                }

                // Normal Text Testimonial Card
                // Make 1/4 of the text cards larger, semi-bold, and italic based on their position
                const isHighlighted = (colIndex + index) % 3 === 0;
                
                return (
                  <div 
                    key={item._key || index} 
                    className="rounded-[2rem] bg-white backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100/50 text-left p-[3.5rem] flex flex-col transform transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                  >
                    
                    <div className={cn(
                      "text-[#0a2540] mb-8 [&_p]:mb-4 last:[&_p]:mb-0 [&_strong]:font-bold [&_strong]:text-[#051426]",
                      isHighlighted 
                        ? "text-[1.8rem] leading-[1.5] font-semibold italic" 
                        : "text-[1.4rem] leading-[1.6]"
                    )}>
                      <PortableTextContainer data={item.description} />
                    </div>

                    <div className="mt-auto flex items-center gap-4">
                      {/* Optional Image (Logo) for text testimonial */}
                      {item.image?.asset && (
                        <div className="relative w-[4.5rem] h-[4.5rem] shrink-0 rounded-full overflow-hidden bg-slate-50 border border-slate-100">
                          <Image
                            src={urlFor(item.image).url()}
                            alt={item.title || 'testimonial author'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex flex-col">
                        {item.title && (
                          <h3 className="text-[1.3rem] font-bold text-[#0a2540] leading-tight mb-0.5">
                            {item.title}
                          </h3>
                        )}
                        {item.subTitle && (
                          <p className="text-[1.1rem] text-[#0a2540]/60 font-medium">
                            {item.subTitle}
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
