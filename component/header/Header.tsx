'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CartIcon, CartIcon2, HomeIcon } from '../icons/icons';
import Dropdown from './Dropdown';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import dynamic from 'next/dynamic';
import CartButton from '../cart/cart-button/CartButton';
import { useIsClient } from '@/hooks/useIsClient';

interface HeaderProps {
  label: string;
  href: string;
  items?:
    | {
        label: string;
        href: string;
      }[]
    | undefined;
}

const Header = () => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  const { user, loading, signOut } = useAuth();
  const { totalItems } = useCart();

  const { scrollY } = useScroll();

  // if (user !== null) {
  //   console.log('USER', user);
  // }

  useMotionValueEvent(scrollY, 'change', latest => {
    if (latest > 200) {
      setIsSticky(true);
    } else if (latest < 80) {
      setIsSticky(false);
    }
  });

  const navItems = [
    {
      label: 'Categories',
      href: 'categories',
      items: [
        {
          label: 'diaries',
          desc: 'Consectetur adipisicing elit.',
          href: 'diaries',
        },
        {
          label: 'cards',
          desc: 'Lorem ipsum dolor sit.',
          href: 'cards',
        },
        {
          label: 'Other',
          desc: 'Lorem sit amet consectetur.',
          href: 'other',
        },
      ],
    },
    { label: 'Pricing', href: 'pricing' },
    { label: 'About', href: 'about' },
    { label: 'Contact', href: 'contact' },
    { label: 'Blog', href: 'blog' },
  ];

  const navigationContainer = navItems.map(
    (item: HeaderProps, index: number) => (
      <motion.li
        key={index + 'navmenu'}
        className="px-6 py-2 relative"
        onMouseEnter={() => {
          setHoveredItem(index);
          if (item.items) {
            setOpenDropdown(index);
          }
        }}
        onMouseLeave={() => {
          setHoveredItem(null);
          setOpenDropdown(null);
        }}>
        {hoveredItem === index && (
          <motion.div
            className="absolute inset-0 w-full h-full bg-green-5 rounded-[0.8rem] -z-10"
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
        <Link className="z-20" href={`/${item?.href}`}>
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

        {/* Dropdown */}
        <Dropdown data={item} openDropdown={openDropdown} index={index} />
      </motion.li>
    ),
  );

  return (
    <>
      <motion.nav className="relative bg-pink-1 text-green-dark grid justify-items-center text-[1.8rem] pt-[3.5rem] pb-[4rem]">
        {/* <div className="text-[2.4rem] md:text-[4.2rem]">
          <Link href={'/'}>
            <Image src={'/logo-ctr.svg'} alt="logo" width={200} height={50} />
          </Link>
        </div> */}

        <motion.section
          layout
          animate={{ scale: isSticky ? 1.03 : 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.5,
          }}
          className={cn(
            'cursor-pointer gap-2 flex bg-white rounded-[0.8rem] border-[1px] z-20 relative',
            isSticky
              ? 'fixed top-[1rem] shadow-xl'
              : 'absolute top-[9.5rem] shadow-lg',
          )}>
          <div className="flex">
            <Link
              href={'/'}
              className={cn(
                'grid bg-green-1 hover:bg-green-5 rounded-l-[0.8rem] hover:text-white transition duration-200 ease-in-out place-items-center px-[10px] border-r-[1px]',
              )}>
              {HomeIcon}
            </Link>

            <ul className="flex  py-2  items-center justify-center min-w-max">
              {navigationContainer}
            </ul>
          </div>

          <CartButton />

          {/*====== AUTH COMPONENT ===== */}
          {/* TODO: move the logic to a separate component */}

          <motion.div
            animate={{ scale: isSticky ? 1.03 : 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.5,
            }}
            className={cn(
              ' cursor-pointer flex items-center justify-center z-20 bg-white rounded-full w-16 h-16 border-[2px] ',
              isSticky
                ? 'fixed top-[0.5rem] -right-[12%] shadow-xl'
                : 'absolute top-[0.5rem] -right-[12%] shadow-lg',
            )}>
            {user ? (
              <>
                <button>
                  <Image
                    src={user?.user_metadata?.avatar_url}
                    alt="avatar"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                </button>
              </>
            ) : (
              <Link href="/login">X</Link>
            )}
          </motion.div>
          {/* =========== */}
        </motion.section>
      </motion.nav>
    </>
  );
};

export default Header;
