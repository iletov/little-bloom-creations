import { cn } from '@/lib/utils';
import React from 'react';

export const Description = ({
  data,
  className,
}: {
  data: string | undefined;
  className?: string;
}) => {
  return (
    <div className="text-center">
      <p
        className={cn(
          'text-[1rem] leading-[120%] font-montserrat text-foreground',
          className,
        )}>
        {data}
      </p>
    </div>
  );
};
