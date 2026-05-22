import { cn } from '@/lib/utils';
import React from 'react';

export const Heading = ({
  data,
  className,
}: {
  data: string | undefined;
  className?: string;
}) => {
  return (
    <h2 className={cn('font-montserrat text-center', className)}>{data}</h2>
  );
};
