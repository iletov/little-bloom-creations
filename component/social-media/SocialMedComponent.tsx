import { cn } from '@/lib/utils';
import { Aperture } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import VerticalLine from '../separator/VerticalLine';

const socialMediaItems = [
  { icon: <Aperture size={20} stroke="#fff" />, link: '#' },
  { icon: <Aperture size={20} stroke="#fff" />, link: '#' },
  { icon: <Aperture size={20} stroke="#fff" />, link: '#' },
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
        <VerticalLine className="md:min-h-[20vh]" />
      </div>

      <div className="translate-x-[4rem] origin-center">
        <p className="text-pink-1 text-[1.4rem] font-light tracking-wider whitespace-nowrap">
          Follow us
        </p>
      </div>
    </div>
  );
};

export default SocialMedComponent;
