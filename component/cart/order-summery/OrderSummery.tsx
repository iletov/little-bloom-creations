import { Loader } from '@/component/loader/Loader';
import { Separator } from '@/component/separator/Separator';
import { Button } from '@/components/ui/button';
import React from 'react';

type OrderSummeryProps = {
  totalItemsCount: number;
  totalPrice: number;
  loadingState: boolean;
  handleCheckOut: () => void;
  deliveryCost: number;
};

export const OrderSummery = ({
  totalItemsCount,
  totalPrice,
  loadingState,
  handleCheckOut,
  deliveryCost,
}: OrderSummeryProps) => {
  return (
    <div
      className="
      z-50
      w-full max-w-full mx-auto h-fit md:border-[1px]
      font-montserrat
      rounded-lg
      shadow-
      bg-white
      space-y-1.5
      md:space-y-3
      px-6 py-4 
      order-first 
      fixed bottom-0 left-0 
      lg:left-auto lg:sticky 
      lg:top-24 lg:order-last ">
      <h3 className="md:font-semibold">Резюме на поръчката:</h3>
      <p className="flex justify-between text-[1.6rem]">
        <span className="">Артикули:</span>
        <span>х {totalItemsCount}</span>
      </p>
      <Separator />
      <p className="flex justify-between text-[1.6rem]">
        <span className="">Цена за доставка:</span>
        <span>{deliveryCost} лв.</span>
      </p>
      <p className="flex justify-between mb-2 md:mb-6">
        <span className="font-semibold text-[1.6rem]">Обща сума:</span>
        <span className="font-semibold text-[1.6rem]">
          {(totalPrice + deliveryCost).toFixed(2)} лв.
        </span>
      </p>

      <Button
        onClick={handleCheckOut}
        variant="default"
        className="w-full bg-secondaryPurple hover:bg-secondaryPurple/80 text-foreground">
        {loadingState ? <Loader /> : 'Checkout'}
      </Button>
    </div>
  );
};
