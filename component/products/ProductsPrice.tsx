import { calculateDiscountAmount } from '@/lib/discountamount';
import { cn } from '@/lib/utils';
import React from 'react';

export const ProductsPrice = ({
  product,
  priceTag,
  className,
}: {
  product: any;
  priceTag?: string;
  className?: string;
}) => {
  return (
    <div className={cn(`flex gap-2 text-foreground text-[1.6rem]`, className)}>
      {product?.discount ? (
        <p>
          {priceTag && <span className="mr-1">{priceTag}</span>}
          <span className="line-through opacity-50"> {product?.price} лв.</span>
        </p>
      ) : (
        <p>{product?.price} лв.</p>
      )}

      {product?.discount && (
        <div className="flex ">
          <p>
            {calculateDiscountAmount({
              price: product?.price ?? 0,
              discount: product?.discount ?? 0,
            }).toFixed(2)}{' '}
            лв.
          </p>
        </div>
      )}
    </div>
  );
};
