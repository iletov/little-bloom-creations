import { cn } from '@/lib/utils';
import { Aperture } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import VerticalLine from '../separator/VerticalLine';
import { Facebook, Instagram, TikTok } from '../icons/icons';

const socialMediaItems = [
  { icon: <Facebook className="w-[22px] h-[22px]" />, link: '#' },
  { icon: <Instagram className="w-[24px] h-[24px]" />, link: '#' },
  { icon: <TikTok className="w-[24px] h-[24px]" />, link: '#' },
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
