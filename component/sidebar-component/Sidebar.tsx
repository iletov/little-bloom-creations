'use client';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { SidebarLinks } from './SidebarLinks';
import { SocialLinks } from './SocialLinks';
import {
  internalGroqTypeReferenceTo,
  Slug,
  SocialMediaType,
} from '@/sanity.types';
import { motion } from 'framer-motion';
import LiquidDrop from '../animations/LiquidDrop';

export interface SidebarProps {
  header?: string;
  slug?: Slug;
  links?: {
    _type?: 'reference';
    _key?: string;
    slug?: Slug;
    [internalGroqTypeReferenceTo]?: 'sanity.page';
    title?: string;
  }[];
  socialMedia?: SocialMediaType[];
  // onLinkClick?: () => void;
}

export const Sidebar = ({
  data,
  socialMediaIcons,
}: {
  data?: SidebarProps;
  socialMediaIcons?: Array<SocialMediaType>;
}) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [hoverElement, setHoverElement] = useState<boolean>(false);
  const minSwipeDistance = 50;

  const handleClose = () => {
    setOpen(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;

    if (isLeftSwipe) {
      handleClose();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="cursor-pointer">
          <motion.div
            onMouseEnter={() => setHoverElement(true)}
            onMouseLeave={() => setHoverElement(false)}>
            <Menu size={30} className="text-darkGold cursor-pointer" />
            {hoverElement && <LiquidDrop />}
          </motion.div>
        </SheetTrigger>
        <SheetContent
          side="left"
          className=" min-w-max sidebar-bg_gradient"
          ref={contentRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}>
          <SheetHeader className="mt-10 mb-6">
            <SheetTitle className="font-play text-[1.6rem] md:text-[2rem] my-4 flex justify-center items-center gap-4 uppercase">
              <Link href={data?.slug?.current ?? ''} onClick={handleClose}>
                <header>
                  <h2>{data?.header}</h2>
                </header>
              </Link>
            </SheetTitle>
          </SheetHeader>
          {/* <div className="flex flex-col justify-between"> */}
          <div className="flex flex-grow flex-col h-[75dvh] ">
            <div className="flex justify-center">
              <SidebarLinks data={data} onLinkClickAction={handleClose} />
            </div>
            <div className="mt-auto">
              <SocialLinks
                data={socialMediaIcons}
                onLinkClickAction={handleClose}
              />
            </div>
            {/* <div className="mt-auto flex justify-center">
              <UserActions onLinkClickAction={handleClose} />
            </div> */}
          </div>
          {/* </div> */}
        </SheetContent>
      </Sheet>
    </>
  );
};
