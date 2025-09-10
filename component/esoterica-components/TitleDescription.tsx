import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { cn } from '@/lib/utils';
import { PortableTextBlockStyle } from '@portabletext/types';

interface TitleDescriptionProps {
  data: {
    heading: string;
    description: PortableTextBlockStyle;
    floatingImage: any[];
  };
  textColor?: string;
}

export const TitleDescription = ({
  data,
  textColor = 'text-foreground',
}: TitleDescriptionProps) => {
  return (
    <section
      className={`relative max-w-[1366px] mx-auto px-5 font-montserrat `}>
      <header
        className={cn(
          'flex flex-col  items-center justify-center z-[100]',
          textColor,
        )}>
        <h2 className="heading2 text-center"> {data?.heading}</h2>

        <PortableTextContainer
          data={data?.description}
          className={cn(
            ` text-[1rem] font-montserrat max-w-[105ch]`,
            textColor,
          )}
        />
      </header>
      {/* float image */}
      {data?.floatingImage ? (
        <div className="w-full h-full max-w-[125px] max-h-[110px] absolute top-5 left-4">
          <Image
            src={urlFor(data?.floatingImage[0]).url()}
            alt={data?.heading}
            width={1200}
            height={1200}
            className="w-full h-full object-cover "
          />
        </div>
      ) : null}
    </section>
  );
};
