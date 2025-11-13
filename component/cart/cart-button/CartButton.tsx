'use client';
import { CartIcon2 } from '@/component/icons/icons';
import { useCart } from '@/hooks/useCart';
import { useIsClient } from '@/hooks/useIsClient';
import Link from 'next/link';
import React from 'react';

const CartButton = () => {
  const { totalItems } = useCart();
  const isClient = useIsClient();

  return (
    <Link
      href={'/cart'}
      className="grid text-green-dark hover:text-green-9/60 transition duration-200 ease-in-out place-items-center px-[10px] border-l-[1px]">
      {CartIcon2}
      {isClient && totalItems ? (
        <span className="absolute -top-2 -right-4 rounded-full w-8 h-8 grid place-items-center bg-rose-800 text-white text-[1rem]">
          {totalItems}
        </span>
      ) : (
        <span className="invisible w-8 h-8 absolute -top-2 -right-4" />
      )}
    </Link>
  );
};

export default CartButton;
