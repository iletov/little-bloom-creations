// 'use client';
import React from 'react';
import FooterContent from './FooterContent';
import { LayoutProps, SocialMediaType } from '@/sanity.types';
// import { usePathname } from 'next/navigation';

const Footer = ({
  data,
  socialMediaIcons,
}: {
  data: LayoutProps;
  socialMediaIcons: Array<SocialMediaType>;
}) => {
  return (
    <footer>
      <div
        className="relative h-[200px]"
        style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}>
        <div className="fixed bottom-0 w-full">
          <FooterContent data={data} socialMediaIcons={socialMediaIcons} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
