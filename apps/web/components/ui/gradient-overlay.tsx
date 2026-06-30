import { cn } from '@/lib/utils';
import React from 'react';

interface GradientOverlayProps {
  className?: string;
}

export const GradientOverlay = ({ className }: GradientOverlayProps) => {
  return (
    <div 
      className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10",
        className
      )} 
    />
  );
};
