'use client';
import { useCart } from '@/hooks/useCart';
import React, { useEffect, useState } from 'react';
import { ItemsList } from '@/component/cart/items-list/ItemsList';
import { OrderDetailsContainer } from '@/component/cart/order-details-container/OrderDetailsContainer';
import { OrderSummery } from '@/component/cart/order-summery/OrderSummery';
import Image from 'next/image';

export default function CartComponent() {
  const [isClient, setIsClient] = useState(false);

  const { items } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center space-y-4 justify-center h-screen">
        <div className="max-w-[150px] md:max-w-[250px] md:max-h-[250px]">
          <Image
            src={'/emptyCart.png'}
            alt="cart-empty"
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-[1.6rem] md:text-[2rem] font-montserrat">
          Количката е празна...
        </h1>
      </div>
    );

  return (
    <section className="">
      <div className="section_wrapper pt-40  font-montserrat xl:px-32 space-y-5 md:flex gap-10 xl:gap-10 mb-[30rem] lg:mb-[24rem]">
        <div className="flex-[1.1] lg:mt-5 px-3">
          <div className="  bg-secondaryPurple/15 rounded-lg shadow-md">
            {items?.map(group => (
              <ItemsList
                key={group.product._id + crypto.randomUUID().slice(0, 6)}
                group={group}
              />
            ))}
          </div>
          <div className="my-10"></div>

          <OrderDetailsContainer />
        </div>
        <div className=" flex-[0.75]">
          <OrderSummery />
        </div>
      </div>
    </section>
  );
}
