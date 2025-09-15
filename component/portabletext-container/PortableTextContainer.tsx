import { cn } from '@/lib/utils';
import { PortableText } from 'next-sanity';
import React from 'react';

export const PortableTextContainer = ({ data, className }: any) => {
  return (
    <div
      className={cn(
        // `prose prose-invert prose-li:marker:text-foreground`,
        `prose text-[1.6rem] leading-[1.4] font-montserrat`,
        className,
      )}>
      {Array.isArray(data) ? <PortableText value={data} /> : <p>{data}</p>}
    </div>
  );
};
