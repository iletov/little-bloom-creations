'use client';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { Trash } from 'lucide-react';
import React from 'react';

type ClearButtonProps = {
  cartId: string;
  className?: string;
};

const ClearCartButton = ({ cartId, className }: ClearButtonProps) => {
  const { removeItem } = useCart();

  return (
    <>
      <Button
        onClick={() => removeItem(cartId)}
        className={cn('w-fit px-1 py-1 bg-white hover:bg-[unset]', className)}>
        <Trash className="text-pink-600" />
      </Button>
    </>
  );
};

export default ClearCartButton;
