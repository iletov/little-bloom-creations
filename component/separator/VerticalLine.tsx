import { cn } from '@/lib/utils';
import React from 'react';

const VerticalLine = ({ className }: { className?: string }) => {
  return <div className={cn('w-[1px] h-full bg-pink-1', className)} />;
};

export default VerticalLine;
