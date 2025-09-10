import { cn } from '@/lib/utils';
import { PortableText } from 'next-sanity';
import React from 'react';

export const PortableTextContainer = ({ data, className }: any) => {
  return (
    <div
      className={cn(
        `prose prose-invert prose-li:marker:text-foreground`,
        className,
      )}>
      {Array.isArray(data) ? <PortableText value={data} /> : <p>{data}</p>}
    </div>
  );
};
