import { cn } from '@/lib/utils';
import { PortableText } from 'next-sanity';
import React from 'react';
import { CheckMarkIcon } from '../icons/icons';

const portableTextComponents = {
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-none pl-0 space-y-3">{children}</ul>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="flex items-start gap-3">
        <span className="inline-flex mt-1 flex-shrink-0">
          <CheckMarkIcon
            className="w-6 h-6"
            color="var(--green-9)"
            border="var(--green-5)"
          />
        </span>
        <div className="flex-1">{children}</div>
      </li>
    ),
  },
};

export const PortableTextContainer = ({ data, className }: any) => {
  return (
    <div
      className={cn(
        // `prose prose-invert prose-li:marker:text-foreground`,
        `prose text-[1.6rem] leading-[1.4] font-montserrat `,
        className,
      )}>
      {Array.isArray(data) ? (
        <PortableText value={data} components={portableTextComponents} />
      ) : (
        <p>{data}</p>
      )}
    </div>
  );
};
