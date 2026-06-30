'use client';
import { Separator } from '@/component/separator/Separator';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface OrderSummeryProps {
  isCartView?: boolean;
}

export const OrderSummery = ({ isCartView = false }: OrderSummeryProps) => {
  const {
    totalItems,
    totalPrice,
    deliveryCost,
  } = useCart();

  const router = useRouter();

  return (
    <>
      <div
        className="
      z-50 w-full max-w-full mx-auto h-fit md:border-[1px] font-montserrat rounded-lg shadow-md bg-white space-y-1.5 md:space-y-3 px-6 py-4 order-first fixed bottom-0 left-0 lg:left-auto lg:sticky lg:top-[10rem] lg:order-last ">
        <h3 className="md:font-semibold">Информация за поръчката:</h3>
        <p className="flex justify-between text-[1.6rem]">
          Артикули:
          <span className="flex gap-1">
            <X size={10} className="self-center" /> {totalItems}
          </span>
        </p>
        <Separator />
        {isCartView ? null : (
          <p className="flex justify-between text-[1.6rem]">
            <span className="">Цена за доставка:</span>
            <span>{deliveryCost} €</span>
          </p>
        )}
        <p className="flex justify-between mb-2 md:mb-6">
          <span className="font-semibold text-[1.6rem]">Обща сума:</span>
          <span className="font-semibold text-[1.6rem]">
            {isCartView
              ? totalPrice.toFixed(2)
              : (totalPrice + deliveryCost).toFixed(2)}{' '}
            €
          </span>
        </p>

        {isCartView && (
          <Button
            onClick={() => router.push('/checkout')}
            variant="default"
            className="w-full">
            Продължи към плащане
          </Button>
        )}
      </div>
    </>
  );
};
