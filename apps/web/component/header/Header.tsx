'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import Dropdown from './Dropdown';
import { useAuth } from '@/hooks/useAuth';
import CartButton from '../cart/cart-button/CartButton';
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  LogOut,
  Mail,
  Menu,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Store,
  User,
  X,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useIsClient } from '@/hooks/useIsClient';

import { Product } from '../products/types';

interface HeaderProps {
  label: string;
  href: string;
  items?: {
    label: string;
    desc?: any;
    href: string;
    image?: any;
  }[];
  products?: Product[];
  adminOnly?: boolean;
}

const getAvatarUrl = (metadata: Record<string, unknown>): string | null => {
  const avatarUrl = metadata.avatar_url;
  if (typeof avatarUrl === 'string' && avatarUrl.length > 0) {
    return avatarUrl;
  }

  const picture = metadata.picture;
  return typeof picture === 'string' && picture.length > 0 ? picture : null;
};

const getProfileName = (metadata: Record<string, unknown>): string => {
  const fullName = metadata.full_name;
  if (typeof fullName === 'string' && fullName.length > 0) {
    return fullName;
  }

  const name = metadata.name;
  return typeof name === 'string' && name.length > 0 ? name : 'Profile';
};

const getMetadataString = (
  metadata: Record<string, unknown>,
  keys: string[],
): string | null => {
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return null;
};

const formatProfileDate = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('bg-BG', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const getNavItems = (categories?: any[], products?: Product[]): HeaderProps[] => [
  {
    label: 'Продукти',
    href: 'categories',
    items: categories && categories.length > 0 ? categories.map((cat: any) => ({
      label: cat.name,
      desc: cat.description,
      href: cat.slug?.current || '',
      image: cat.image,
    })) : [],
    products: products || [],
  },
  { label: 'Как се поръчва', href: '#how-to-order' },
  { label: 'За нас', href: 'about' },
  { label: 'Контакти', href: 'contact' },
  { label: 'Блог', href: 'blog' },
];

const mobileContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const Header = ({ categories, products }: { categories?: any[], products?: Product[] }): React.JSX.Element => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  
  const defaultHasHero = pathname === '/' || pathname === '/categories' || pathname.startsWith('/categories/');
  const [isHome, setIsHome] = useState(defaultHasHero);
  const [isLargeHero, setIsLargeHero] = useState(defaultHasHero);

  useEffect(() => {
    // Automatically make the header transparent if there's a HeroBanner on the page
    const hero = document.querySelector('[data-hero-banner="true"]');
    if (hero) {
      setIsHome(true);
      setIsLargeHero(hero.getAttribute('data-hero-size') !== 'small');
    } else {
      setIsHome(defaultHasHero);
      setIsLargeHero(defaultHasHero);
    }
  }, [pathname, defaultHasHero]);

  const { totalItems } = useCart();
  const isClient = useIsClient();

  const { user, signOut } = useAuth();
  const { scrollY } = useScroll();
  const avatarUrl = user ? getAvatarUrl(user.user_metadata) : null;
  const profileName = user ? getProfileName(user.user_metadata) : '';
  const birthDate = user
    ? formatProfileDate(
        getMetadataString(user.user_metadata, [
          'birth_date',
          'birthdate',
          'date_of_birth',
          'dob',
        ]),
      )
    : null;
  const provider =
    user && typeof user.app_metadata.provider === 'string'
      ? user.app_metadata.provider
      : user?.identities?.[0]?.provider ?? 'email';
  const profileRole =
    user && typeof user.app_metadata.role === 'string'
      ? user.app_metadata.role
      : null;
  const isAdmin = profileRole === 'admin' || profileRole === 'superadmin';
  const navItems = getNavItems(categories, products);
  const visibleNavItems = navItems.filter(
    item => !item.adminOnly || isAdmin,
  );
  const createdAt = formatProfileDate(user?.created_at);
  const lastSignInAt = formatProfileDate(user?.last_sign_in_at);

  useMotionValueEvent(scrollY, 'change', latest => {
    if (latest > 50) {
      setIsSticky(true);
    } else if (latest < 20) {
      setIsSticky(false);
    }
  });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!profileMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (
        event.target instanceof Node &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileMenuOpen]);

  const handleSignOut = async (): Promise<void> => {
    setProfileMenuOpen(false);
    await signOut();
  };

  const navigationContainer = visibleNavItems.map(
    (item: HeaderProps, index: number) => (
      <motion.li
        key={index + 'navmenu'}
        className={cn(
          'relative cursor-pointer rounded-full px-4 py-4',
          item.adminOnly &&
            'ml-3 before:absolute before:-left-2 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-slate-200',
        )}
        onMouseEnter={() => {
          setHoveredItem(index);
          if (item.items) {
            setOpenDropdown(index);
          } else {
            setOpenDropdown(null);
          }
        }}>
        {hoveredItem === index && !item.adminOnly && (
          <motion.div
            className="absolute inset-0 w-full h-full bg-green-5 rounded-full z-0 pointer-events-none"
            layoutId="navbar-hover-bg"
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 30,
            }}
          />
        )}
        <Link
          className={cn(
            'relative z-10 flex items-center gap-2',
            item.adminOnly &&
              'text-green-5 transition-colors duration-200 hover:text-green-9',
          )}
          href={`/${item.href}`}>
          {item.adminOnly ? (
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          ) : null}
          <motion.p
            className={cn(
              'transition duration-200 font-medium whitespace-nowrap',
              item.adminOnly
                ? 'text-inherit'
                : hoveredItem === index
                ? 'text-white'
                : 'text-green-dark hover:opacity-80',
            )}>
            {item.label}
          </motion.p>
        </Link>

        {/* Dropdown */}
        <Dropdown data={item} openDropdown={openDropdown} index={index} />
      </motion.li>
    ),
  );

  return (
    <>
      <nav className="relative flex justify-center text-[1.8rem] text-green-dark font-montserrat">
        {/* Desktop & Mobile Top Header Wrapper */}
        <div
          className={cn(
            'left-0 right-0 z-30 mx-auto flex w-full items-center justify-center',
            isHome 
              ? 'absolute top-0 lg:fixed'
              : 'relative lg:sticky lg:top-0'
          )}>
          {/* Main Navbar */}
          <section
            className={cn(
              'w-full transition-colors duration-300 relative',
              !isHome 
                ? 'bg-white shadow-md border-b border-slate-200'
                : (isSticky 
                    ? 'bg-transparent lg:bg-white lg:shadow-md lg:border-b lg:border-slate-200' 
                    : 'bg-transparent border-transparent lg:bg-white lg:border-b lg:border-slate-200')
            )}>
            <div className="section_wrapper h-[5.5rem] grid w-full grid-cols-[1fr_auto_1fr] items-stretch">
            {/* Left Side: Desktop Navigation (Hidden on mobile) */}
            <div className="hidden lg:flex items-stretch justify-start flex-1">
              <ul
                className="flex items-center gap-2  h-full"
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setOpenDropdown(null);
                }}>
                {navigationContainer}
              </ul>
            </div>
            
            {/* Mobile Fallback Left Side (Empty or Mobile Menu Trigger) */}
            <div className="flex lg:hidden items-center justify-start flex-1 px-4">
              {/* Mobile menu trigger is in bottom nav */}
            </div>

            {/* Center: Logo */}
            <div className="flex items-center justify-center">
              <Link
                href={'/'}
                className="grid place-items-center px-4 rounded-none transition-transform"
              >
                <Image
                  src="/logo-ctr.svg"
                  alt="Little Bloom Creations"
                  width={118}
                  height={34}
                  priority
                  className="h-auto w-[9.6rem] object-contain sm:w-[11.8rem]"
                />
              </Link>
            </div>

            {/* Right Side: Cart & Auth (Hidden on mobile as it's in bottom nav) */}
            <div className="hidden lg:flex relative flex-1 items-stretch justify-end">
              <CartButton />
              <div
                ref={profileMenuRef}
                className="relative flex h-full items-stretch">
                {user ? (
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen(current => !current)}
                    className={cn(
                      'group grid h-full min-w-[62px] place-items-center overflow-hidden border-l-[1px] px-[18px] text-green-dark transition duration-200 hover:text-green-5 sm:min-w-[68px]',
                      profileMenuOpen && 'text-green-5',
                    )}
                    aria-label="Open profile menu"
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="menu">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Profile picture"
                        width={42}
                        height={42}
                        className="h-[42px] w-[42px] rounded-full border border-green-5/40 object-cover transition-all group-hover:ring-2 group-hover:ring-green-5 group-hover:ring-offset-2"
                      />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="grid h-full min-w-[62px] place-items-center border-l-[1px] px-[18px] text-green-dark transition duration-200 hover:text-green-5 sm:min-w-[68px]"
                    aria-label="Login">
                    <User className="h-6 w-6" />
                  </Link>
                )}
                <AnimatePresence>
                  {user && profileMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full z-50 w-[32rem] pt-6"
                      role="menu">
                      <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto rounded-2xl border border-slate-200/60 bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
                        <div className="flex justify-center px-4 py-3">
                          <div className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-full border-2 border-green-5/40 bg-green-1 shadow-sm">
                            {avatarUrl ? (
                              <Image
                                src={avatarUrl}
                                alt="Profile picture"
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            ) : (
                              <User className="h-10 w-10 text-green-dark" />
                            )}
                          </div>
                        </div>

                        <div className="mx-auto my-3 h-px w-[92%] bg-slate-100" />

                        <div className="space-y-1 px-2 pb-2">
                          <div className="flex items-start gap-3 rounded-xl px-3 py-2.5">
                            <User className="mt-0.5 h-5 w-5 flex-none text-green-9" />
                            <div className="min-w-0">
                              <p className="text-[1.1rem] font-medium uppercase text-slate-400">
                                Име
                              </p>
                              <p className="truncate text-[1.4rem] font-semibold text-slate-800">
                                {profileName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 rounded-xl px-3 py-2.5">
                            <Mail className="mt-0.5 h-5 w-5 flex-none text-green-9" />
                            <div className="min-w-0">
                              <p className="text-[1.1rem] font-medium uppercase text-slate-400">
                                Имейл
                              </p>
                              <p className="break-all text-[1.4rem] font-medium text-slate-700">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          {user.phone ? (
                            <div className="flex items-start gap-3 rounded-xl px-3 py-2.5">
                              <Phone className="mt-0.5 h-5 w-5 flex-none text-green-9" />
                              <div>
                                <p className="text-[1.1rem] font-medium uppercase text-slate-400">
                                  Телефон
                                </p>
                                <p className="text-[1.4rem] font-medium text-slate-700">
                                  {user.phone}
                                </p>
                              </div>
                            </div>
                          ) : null}

                          {birthDate ? (
                            <div className="flex items-start gap-3 rounded-xl px-3 py-2.5">
                              <CalendarDays className="mt-0.5 h-5 w-5 flex-none text-green-9" />
                              <div>
                                <p className="text-[1.1rem] font-medium uppercase text-slate-400">
                                  Дата на раждане
                                </p>
                                <p className="text-[1.4rem] font-medium text-slate-700">
                                  {birthDate}
                                </p>
                              </div>
                            </div>
                          ) : null}

                          <div className="flex items-start gap-3 rounded-xl px-3 py-2.5">
                            {provider === 'google' ? (
                              <Image
                                src="/google-g.svg"
                                alt=""
                                width={20}
                                height={20}
                                className="mt-0.5 h-5 w-5 flex-none"
                              />
                            ) : (
                              <Mail className="mt-0.5 h-5 w-5 flex-none text-green-9" />
                            )}
                            <div>
                              <p className="text-[1.1rem] font-medium uppercase text-slate-400">
                                Вход чрез
                              </p>
                              <p className="text-[1.4rem] font-medium capitalize text-slate-700">
                                {provider}
                              </p>
                            </div>
                          </div>

                          {profileRole ? (
                            <div className="flex items-start gap-3 rounded-xl px-3 py-2.5">
                              <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-green-9" />
                              <div>
                                <p className="text-[1.1rem] font-medium uppercase text-slate-400">
                                  Роля
                                </p>
                                <p className="text-[1.4rem] font-medium capitalize text-slate-700">
                                  {profileRole}
                                </p>
                              </div>
                            </div>
                          ) : null}

                          {createdAt ? (
                            <div className="flex items-start gap-3 rounded-xl px-3 py-2.5">
                              <CalendarDays className="mt-0.5 h-5 w-5 flex-none text-green-9" />
                              <div>
                                <p className="text-[1.1rem] font-medium uppercase text-slate-400">
                                  Регистрация
                                </p>
                                <p className="text-[1.4rem] font-medium text-slate-700">
                                  {createdAt}
                                </p>
                              </div>
                            </div>
                          ) : null}

                          {lastSignInAt ? (
                            <div className="flex items-start gap-3 rounded-xl px-3 py-2.5">
                              <Clock3 className="mt-0.5 h-5 w-5 flex-none text-green-9" />
                              <div>
                                <p className="text-[1.1rem] font-medium uppercase text-slate-400">
                                  Последно влизане
                                </p>
                                <p className="text-[1.4rem] font-medium text-slate-700">
                                  {lastSignInAt}
                                </p>
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <div className="mx-auto my-3 h-px w-[92%] bg-slate-100" />

                        <Link
                          href="/orders"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex w-full items-center justify-start gap-3 rounded-xl px-5 py-3.5 text-[1.4rem] font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 hover:text-green-dark"
                          role="menuitem">
                          <ShoppingBag className="h-5 w-5 text-green-9" />
                          Моите поръчки
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/dashboard"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex w-full items-center justify-start gap-3 rounded-xl px-5 py-3.5 text-[1.4rem] font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 hover:text-green-dark"
                            role="menuitem">
                            <ShieldCheck className="h-5 w-5 text-green-9" />
                            Dashboard
                          </Link>
                        )}

                        <div className="mx-auto my-3 h-px w-[92%] bg-slate-100" />

                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3.5 text-[1.4rem] font-semibold text-rose-600 transition-colors duration-200 hover:bg-rose-50"
                          role="menuitem">
                          <LogOut className="h-5 w-5" />
                          Изход
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
            </div>
          </section>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div
        className={cn(
          'lg:hidden fixed bottom-0 left-0 right-0 z-40 flex w-full items-center rounded-t-[12px] justify-between px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] transition-colors duration-300',
          isSticky || !isLargeHero
            ? 'bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] text-green-dark'
            : 'bg-transparent text-white/90 drop-shadow-md',
        )}>
        <Link href="/categories" className="flex flex-col items-center justify-center gap-1.5 p-2 w-[70px]">
          <Store className="w-7 h-7" />
          <span className="text-[0.75rem] font-bold uppercase tracking-wider">Shop</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center justify-center gap-1.5 p-2 w-[70px]">
          <Menu className="w-7 h-7" />
          <span className="text-[0.75rem] font-bold uppercase tracking-wider">Menu</span>
        </button>
        <Link href="/cart" className="flex flex-col items-center justify-center gap-1.5 p-2 w-[70px] relative">
          <ShoppingBag className="w-7 h-7" />
          {isClient && totalItems && totalItems > 0 ? (
            <span className="absolute right-2 top-0 grid h-[20px] min-w-[20px] place-items-center rounded-full bg-rose-600 text-[11px] font-bold text-white px-1">
              {totalItems}
            </span>
          ) : null}
          <span className="text-[0.75rem] font-bold uppercase tracking-wider">Cart</span>
        </Link>
        {user ? (
          <button onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center justify-center gap-1.5 p-2 w-[70px]">
             {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  width={28}
                  height={28}
                  className={cn("w-7 h-7 rounded-full object-cover", !(isSticky || !isLargeHero) && "border border-white/50")}
                />
              ) : (
                <User className="w-7 h-7" />
              )}
            <span className="text-[0.75rem] font-bold uppercase tracking-wider">Profile</span>
          </button>
        ) : (
          <Link href="/login" className="flex flex-col items-center justify-center gap-1.5 p-2 w-[70px]">
            <User className="w-7 h-7" />
            <span className="text-[0.75rem] font-bold uppercase tracking-wider">Profile</span>
          </Link>
        )}
      </div>

      {/* FULL SCREEN GLASSMORPHISM MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.2 } }}
            className="fixed inset-0 z-[100] bg-white/70 backdrop-blur-2xl flex flex-col lg:hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 mt-4">
              <span className="text-[2.6rem] font-bold text-green-dark font-montserrat tracking-tight">
                Little Bloom
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-14 h-14 bg-white/80 rounded-full flex items-center justify-center shadow-sm border border-green-1 text-green-dark hover:bg-green-5 hover:text-white transition-colors">
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Links */}
            <motion.div
              className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6"
              variants={mobileContainerVariants}
              initial="hidden"
              animate="show"
              exit="hidden">
              {visibleNavItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={mobileItemVariants}
                  className="flex flex-col">
                  <div className="flex items-center justify-between py-2 border-b border-green-200/50 group">
                    <Link
                      href={`/${item.href}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex flex-1 items-center gap-3 py-2 text-[2.2rem] font-semibold text-green-dark transition-colors group-hover:text-green-5',
                        item.adminOnly && 'text-green-5 group-hover:text-green-9',
                      )}>
                      {item.adminOnly ? (
                        <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                      ) : null}
                      {item.label}
                    </Link>
                    {item.items && (
                      <button
                        onClick={e => {
                          e.preventDefault();
                          setOpenAccordion(openAccordion === idx ? null : idx);
                        }}
                        className="p-4 -mr-4 flex items-center justify-center cursor-pointer">
                        <motion.div
                          animate={{ rotate: openAccordion === idx ? 90 : 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                          }}>
                          <ChevronRight className="w-8 h-8 text-green-5" />
                        </motion.div>
                      </button>
                    )}
                  </div>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {item.items && openAccordion === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 24,
                        }}
                        className="overflow-hidden">
                        <div className="flex flex-col gap-2 pl-4 py-4 bg-transparent mb-4 border-l-2 border-green-5/40 ml-4">
                          {item.items.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              href={`/${item.href}/${sub.href}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-4 py-2 px-3 rounded-xl hover:bg-green-5/10 transition-colors group"
                            >
                              {sub.image && (
                                <div className="relative w-[4.5rem] h-[4.5rem] rounded-xl overflow-hidden shadow-sm bg-white border border-green-200/50 shrink-0">
                                  <Image
                                    src={urlFor(sub.image).url()}
                                    alt={sub.label}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              <span className="text-[1.8rem] text-green-dark font-medium group-hover:text-green-5 transition-colors">
                                {sub.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            {/* Footer / Auth */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                type: 'spring',
                stiffness: 300,
                damping: 24,
              }}
              className="p-6 sm:p-8 bg-white/60 border-t border-green-200/50 backdrop-blur-md shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={
                        user?.user_metadata?.avatar_url || '/default-avatar.png'
                      }
                      alt="avatar"
                      width={56}
                      height={56}
                      className="rounded-full border-2 border-green-5 bg-white shadow-sm"
                    />
                    <div className="flex flex-col">
                      <span className="text-[1.6rem] font-bold text-green-dark">
                        Профил
                      </span>
                      <span className="text-[1.2rem] text-gray-500 truncate max-w-[150px]">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-6 py-3 rounded-xl bg-rose-50 text-rose-600 font-semibold text-[1.4rem] hover:bg-rose-100 transition-colors">
                    Изход
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-4 px-2 rounded-2xl text-white font-bold text-[1.5rem] sm:text-[1.8rem] bg-gradient-to-r from-green-dark to-green-5 hover:from-green-9 hover:to-green-dark transition-all shadow-lg shadow-green-5/30 text-center">
                  Вход / Регистрация
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
