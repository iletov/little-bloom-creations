'use client';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { Trash } from 'lucide-react';
import React from 'react';

type ClearButtonProps = {
  productId: string;
  className?: string;
};

const ClearCartButton = ({ productId, className }: ClearButtonProps) => {
  const { removeItem } = useCart();

  return (
    <>
      <Button
        onClick={() => removeItem(productId)}
        className={cn(
          ' px-[unset] py-[unset] w-12 h-12 bg-pink-1 hover:bg-[unset] rounded-full hover:ring-offset-pink-5 hover:ring-pink-5',
          className,
        )}>
        <Trash className="text-pink-600" />
      </Button>
    </>
  );
};

export default ClearCartButton;
