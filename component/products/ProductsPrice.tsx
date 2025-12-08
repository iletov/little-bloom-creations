import { calculateDiscountAmount } from '@/lib/discountamount';
import { cn } from '@/lib/utils';
import React from 'react';

export const ProductsPrice = ({
  price,
  priceTag,
  className,
}: {
  price: any;
  priceTag?: string;
  className?: string;
}) => {
  return (
    <div className={cn(`flex gap-2 text-foreground text-[1.6rem]`, className)}>
      {price?.discount ? (
        <p>
          {priceTag && <span className="mr-1">{priceTag}</span>}
          <span className="line-through opacity-50"> {price} €</span>
        </p>
      ) : (
        <p className="flex items-center">{price} €</p>
      )}

      {price?.discount && (
        <div className="flex ">
          <p>
            {calculateDiscountAmount({
              price: price ?? 0,
              discount: price?.discount ?? 0,
            }).toFixed(2)}{' '}
            лв.
          </p>
        </div>
      )}
    </div>
  );
};
