'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface HeaderProps {
  label: string;
  href: string;
}

const Header = () => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', latest => {
    if (latest > 220) {
      setIsSticky(true);
    } else if (latest < 80) {
      setIsSticky(false);
    }
  });

  const navItems = [
    { label: 'Categories', href: '/categories' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
  ];

  const homeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );

  const cartIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );

  const navigationContainer = navItems.map(
    (item: HeaderProps, index: number) => (
      <motion.li
        key={index + 'navmenu'}
        className="px-6 py-2 relative"
        onMouseEnter={() => setHoveredItem(index)}
        onMouseLeave={() => setHoveredItem(null)}>
        {hoveredItem === index && (
          <motion.div
            className="absolute inset-0 w-full h-full bg-green-5 rounded-[1rem] -z-10"
            layoutId="navbar-hover-bg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
              opacity: { duration: 0.3 },
            }}
          />
        )}

        <Link className="z-20" href={item?.href}>
          <motion.p
            className={cn(
              'transition duration-200',
              hoveredItem === index && 'text-white',
            )}
            // whileHover={{ scale: 1.035 }}
          >
            {item?.label}
          </motion.p>
        </Link>
      </motion.li>
    ),
  );

  return (
    <motion.nav
      // layout
      // transition={{
      //   type: 'spring',
      //   stiffness: 400,
      //   damping: 25,
      //   duration: 0.6,
      // }}
      className="bg-pink-1 text-green-dark grid justify-items-center text-[1.8rem] pt-[3rem] pb-[3.5rem]">
      <div className="text-[2.4rem] md:text-[4.2rem]">
        <Link href={'/'}>
          <Image src={'/logo-ctr.svg'} alt="logo" width={250} height={70} />
        </Link>
      </div>
      <motion.section
        className={cn(
          ' cursor-pointer gap-2 flex z-20 bg-white rounded-[1.6rem] overflow-clip border-[1px] ',
          isSticky
            ? 'fixed top-[1rem] shadow-xl'
            : 'absolute top-[9.5rem] shadow-lg',
        )}
        layout
        animate={{ scale: isSticky ? 1.03 : 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          duration: 0.5,
        }}>
        <Link
          href={'/'}
          className={cn(
            'grid bg-green-1 hover:bg-green-5 hover:text-white transition duration-200 ease-in-out place-items-center px-[10px] border-r-[1px]',
          )}>
          {homeIcon}
        </Link>

        <ul className="flex  py-2  items-center justify-center min-w-max">
          {navigationContainer}
        </ul>

        <Link
          href="#"
          className="grid text-green-dark hover:text-green-9/60 transition duration-200 ease-in-out place-items-center px-[10px] border-l-[1px]">
          {cartIcon}
        </Link>
      </motion.section>
    </motion.nav>
  );
};

export default Header;
