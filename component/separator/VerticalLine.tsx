import { cn } from '@/lib/utils';
import React from 'react';

const VerticalLine = ({ className }: { className?: string }) => {
  return <div className={cn('w-[1px] h-full bg-white', className)} />;
};

export default VerticalLine;
