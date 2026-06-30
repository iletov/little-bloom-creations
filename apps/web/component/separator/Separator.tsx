import { cn } from '@/lib/utils';
import React from 'react';

export const Separator = ({ className }: { className?: string }) => {
  return <div className={cn(className, `h-[1px] my-2`)}></div>;
};
