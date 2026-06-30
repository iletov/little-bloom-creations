import { cn } from '@/lib/utils';
import React from 'react';

type ColorMap = {
  [key: string]: string;
};

export const COLOR_MAP: ColorMap = {
  blue: 'bg-blue-500 ring-blue-500 shadow-blue-500/50',
  red: 'bg-red-500 ring-red-500 shadow-red-500/50',
  green: 'bg-green-500 ring-green-500 shadow-green-500/50',
  yellow: 'bg-yellow-500 ring-yellow-500 shadow-yellow-500/50',
  beige: 'bg-[#F5F5DC] ring-[#F5F5DC] shadow-[#F5F5DC]/50',
  grey: 'bg-gray-500 ring-gray-500 shadow-gray-500/50',
  pink: 'bg-pink-500 ring-pink-500 shadow-pink-500/50',
  white: 'bg-white ring-gray-200 shadow-white/50 border border-gray-200',
  default: 'bg-[#dadad3] ring-[#dadad3] shadow-[#dadad3]/50',
};

export const getColorClass = (color?: string | null) => {
  if (color && color.toLowerCase() !== 'default') {
    const colorKey = color.toLowerCase();
    return COLOR_MAP[colorKey] || COLOR_MAP.default;
  }
  return COLOR_MAP.default;
};

interface ColorBadgeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  color?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export const ColorBadge = ({ color, size = 'md', className, ...props }: ColorBadgeProps) => {
  const sizeClasses = {
    sm: 'w-[2rem] h-[2rem]',
    md: 'w-[3rem] h-[3rem]',
    lg: 'w-[4rem] h-[4rem]',
  };

  return (
    <div
      className={cn(
        'rounded-full ring-0 border-white transition duration-100 ease-in-out',
        sizeClasses[size],
        getColorClass(color),
        className
      )}
      title={color || ''}
      {...props}
    />
  );
};
