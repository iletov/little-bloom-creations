'use client';
import React from 'react';
import FooterContent from './FooterContent';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  
  if (pathname === '/login' || pathname === '/signup' || pathname === '/checkout' || pathname === '/cart') {
    return null;
  }

  return (
    <footer>
      <FooterContent />
    </footer>
  );
};

export default Footer;
