'use client';
import { CartIcon2 } from '@/component/icons/icons';
import { useCart } from '@/hooks/useCart';
import { useIsClient } from '@/hooks/useIsClient';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

type CartButtonProps = {
  className?: string;
};

const CartButton = ({ className }: CartButtonProps): React.JSX.Element => {
  const { totalItems } = useCart();
  const isClient = useIsClient();

  return (
    <Link
      href={'/cart'}
      className={cn(
        'relative grid h-full place-items-center border-l-[1px] px-[18px] text-green-dark transition duration-200 ease-in-out hover:text-green-5 sm:px-[18px]',
        className,
      )}>
      {CartIcon2}
      {isClient && totalItems && totalItems > 0 ? (
        <span className="absolute right-0 top-1 grid h-8 w-8 place-items-center rounded-full bg-rose-800 text-[1rem] text-white">
          {totalItems}
        </span>
      ) : null}
    </Link>
  );
};

export default CartButton;
