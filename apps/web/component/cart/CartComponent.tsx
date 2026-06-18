'use client';
import { useCart } from '@/hooks/useCart';
import React, { useEffect, useState } from 'react';
import { ItemsList } from '@/component/cart/items-list/ItemsList';
import { OrderDetailsContainer } from '@/component/cart/order-details-container/OrderDetailsContainer';
import { OrderSummery } from '@/component/cart/order-summery/OrderSummery';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartComponent() {
  const [isClient, setIsClient] = useState(false);

  const { items } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient)
    return (
      <div className="section_wrapper pt-40 xl:px-32 space-y-5 md:flex gap-10 xl:gap-10 h-screen">
        <div className="flex-[1.1]">
          <Skeleton className="w-full h-[300px] rounded-lg" />
        </div>
        <div className="flex-[0.75]">
          <Skeleton className="w-full h-[400px] rounded-lg" />
        </div>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center space-y-6 justify-center h-screen">
        <div className="max-w-[150px] md:max-w-[250px] md:max-h-[250px]">
          <Image
            src={'/emptyCart.png'}
            alt="cart-empty"
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-[1.6rem] md:text-[2rem] font-montserrat font-semibold">
          Количката е празна...
        </h1>
        <Button asChild size="lg" className="rounded-full bg-green-5 hover:bg-green-dark text-white px-8">
          <Link href="/">Към продуктите</Link>
        </Button>
      </div>
    );

  return (
    <section>
      <div className="section_wrapper pt-40  font-montserrat xl:px-32 space-y-5 md:flex gap-10 xl:gap-10 mb-[30rem] lg:mb-[24rem]">
        <div className="flex-[1.1] lg:mt-5 px-3">
          <div className="  bg-secondaryPurple/15 rounded-lg shadow-md">
            {items?.map(group => (
              <ItemsList
                key={`${group.product._id}-${group.personalisation?.productId || 'default'}`}
                group={group}
              />
            ))}
          </div>
          <div className="my-10"></div>
        </div>
        <div className=" flex-[0.75]">
          <OrderSummery isCartView={true} />
        </div>
      </div>
    </section>
  );
}
