import { cn } from '@/lib/utils';
import { Aperture } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import VerticalLine from '../separator/VerticalLine';

const socialMediaItems = [
  { icon: <Aperture stroke="#fff" />, link: '#' },
  { icon: <Aperture stroke="#fff" />, link: '#' },
  { icon: <Aperture stroke="#fff" />, link: '#' },
];

const SocialMedComponent = ({ className }: { className?: string }) => {
  return (
    <div className={cn('absolute left-12 top-12 z-10', className)}>
      <div className="relative flex flex-col gap-4 items-center h-full">
        {socialMediaItems.map((item, index) => (
          <div key={index} className="flex flex-col gap-4 items-center">
            <Link href={item.link} target="_blank" rel="noopener noreferrer">
              {item.icon}
            </Link>
          </div>
        ))}
        <VerticalLine className="md:min-h-[45vh]" />
      </div>

      <div className="translate-x-[8rem] origin-center">
        <p className="text-white text-[1.2rem] font-light tracking-wider whitespace-nowrap">
          FOLLOW US ON
          <br />
          OUR SOCIAL MEDIA
        </p>
      </div>
    </div>
  );
};

export default SocialMedComponent;
