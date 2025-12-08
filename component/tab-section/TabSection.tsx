'use client';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { descriptionType, ListItems, Title } from '@/types';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import Image from 'next/image';
import React, { useState } from 'react';
import HighlightedHeading from '../heading-description/HighlightedHeading';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

type TabSectionProps = {
  data: {
    heading: Title;
    description?: descriptionType;
    listItems: Array<ListItems>;
  };
};

const TabSection = ({ data }: TabSectionProps) => {
  const [activeKey, setActiveKey] = useState<string | null>(
    data?.listItems[0]?._key || null,
  );

  const activeItem = data?.listItems?.find(item => item?._key === activeKey);

  return (
    <section className="section-y-padding bg-green-1/10">
      <div className="section_wrapper ">
        <header className="grid justify-center text-center gap-[0.8rem] mb-[4rem]">
          <HighlightedHeading
            text={data?.heading?.title}
            word={data?.heading?.highlightedWord}
            color={data?.heading?.highlightedColor}
            tag="h2"
          />
          <PortableTextContainer data={data?.description} />
        </header>

        <div className="flex gap-[2rem] w-full justify-center mb-[2.5rem]">
          {data?.listItems?.map((item: ListItems, index: number) => (
            <Button
              variant={'link'}
              key={index}
              className={cn(
                'text-[1.6rem] px-[1rem] py-[0.5rem] hover:no-underline shadow-md',
                activeKey === item?._key && 'bg-green-1',
              )}
              onClick={() => setActiveKey(item?._key)}>
              <h3 className="text-[1.6rem]">{item?.title}</h3>
            </Button>
          ))}
        </div>

        {/* Content */}
        {activeItem ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem?._key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeIn' }}
              className="grid grid-cols-1 md:grid-cols-[3fr_4fr] gap-[4rem]">
              <figure className="w-full aspect-[1/0.7] rounded-[1rem] overflow-clip">
                <Image
                  src={
                    urlFor(activeItem?.image as SanityImageSource).url() ?? ''
                  }
                  alt={activeItem?.title}
                  width={1024}
                  height={480}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 75vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="grid grid-rows-[auto_1fr_auto]">
                <h4 className="text-green-dark text-[3.2rem] leading-[1] mb-[2rem]">
                  {activeItem?.title}
                </h4>

                <PortableTextContainer data={activeItem?.description} />

                <div>
                  <Button variant={'ghost'} className="">
                    <Link href={activeItem?.button?.slug?.current ?? ''}>
                      {activeItem?.button?.text}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>
    </section>
  );
};

export default TabSection;
