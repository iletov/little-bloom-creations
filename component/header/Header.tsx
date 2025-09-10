'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SearchBarMotion } from '../search-bar/SearchBarMotion';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar } from '../sidebar-component/Sidebar';
import SubHeadingMenu from './SubHeadingMenu';

const Header = ({ data }: { data: any }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // const itemsCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    setIsClient(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isClient) return null;

  console.log('Social Media', data?.social);

  return (
    <header className={cn('transition-colors duration-300 z-50 sticky top-0')}>
      <div
        className={cn(
          ' gap-3 py-3 px-3 border-b-[1px] border-secondaryPurple shadow-sm transition-colors duration-300 z-50 sticky top-0',
          isScrolled
            ? 'bg-primaryPurple/90 backdrop-blur-md will-change-transform'
            : 'bg-primaryPurple',
        )}>
        <div className="max-w-[1366px] mx-auto flex sm:flex-row items-center text-sm text-foreground">
          <div className="flex w-auto relative p-1">
            <Sidebar data={data?.navigation} socialMediaIcons={data?.social} />
          </div>
          <Link
            href={'/'}
            className=" flex justify-center md:justify-start w-full md:mx-[initial] md:ml-4 items-center text-[1.5rem] md:text-xl font-play font-bold uppercase order-2 md:order-1">
            {data?.headerAndFooter?.header}
          </Link>
          <div ref={wrapperRef} className="order-2 ml-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(' top-4 right-3 md:right-20')}>
              <Button
                variant={'outline'}
                className={cn(
                  'w-6 h-[32px] rounded-full bg-transparent border-secondaryPurple',
                  isOpen ? 'opacity-0' : '',
                )}
                onClick={() => setIsOpen(!isOpen)}>
                <SearchIcon size={20} className="text-foreground" />
              </Button>
            </motion.div>

            {isOpen && (
              <div className="absolute right-0 left-0 md:left-[unset] md:right-10 top-[0.625rem] md:top-2.5 z-50  md:w-[32rem]">
                {/* <AnimatePresence> */}
                <motion.div
                  key="search-bar-1"
                  initial={{ opacity: 0, x: 130, y: 0, width: '10%' }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    width: '72%',
                  }}
                  exit={{ opacity: 0, x: -10, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="md:hidden mx-auto">
                  <SearchBarMotion setIsOpenAction={setIsOpen} />
                </motion.div>
                <motion.div
                  key="search-bar-2"
                  initial={{ opacity: 0, x: 260, y: 0, width: '50%' }}
                  animate={{
                    opacity: 1,
                    x: -40,
                    y: 0,
                    width: '100%',
                    // width: '80%',
                  }}
                  transition={{ duration: 0.15 }}
                  className="hidden md:block">
                  <SearchBarMotion setIsOpenAction={setIsOpen} />
                </motion.div>
                {/* </AnimatePresence> */}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <SubHeadingMenu
        className={
          isScrolled
            ? 'bg-darkGold/80 backdrop-blur-md will-change-transform'
            : 'bg-darkGold'
        }
      /> */}
    </header>
  );
};

export default Header;
