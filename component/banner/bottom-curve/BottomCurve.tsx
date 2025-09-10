import { cn } from '@/lib/utils';
import React from 'react';

export const BottomCurve = ({
  background,
  className,
}: {
  background: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'custom-shape-divider-bottom w-full md:hidden absolute -bottom-1 left-0 overflow-hidden md:left-[17%] lg:left-[25%]',
        className,
      )}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 1"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none">
        <path
          d="M650,112.97C328.63,112.77,0,65.52,0,7.23V120H1200V7.23C1270,60.52,941.37,112.97,620,112.97Z"
          className={`${background}`}></path>
      </svg>
    </div>
  );
};
