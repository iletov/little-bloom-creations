'use client';
import { AlertBox } from '@/component/modals/AlertBox';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
// import { EsotericaStore, MusicStore } from '@/sanity.types';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  product: any;
  disable?: boolean;
  size?: string | undefined;
  personalisation?: string;
  cartItem?: {
    product: any;
    quantity: number;
    size?: string;
  };
}

const AddToCartButton = ({
  product,
  personalisation,
}: AddToCartButtonProps) => {
  // console.log(product);

  const { addItem } = useCart();

  function addToCart(item: string, personalisation: string | undefined) {
    if (personalisation !== undefined) {
      addItem(item, personalisation);
    } else {
      addItem(item, '');
    }
    toast.success('Item added to cart', {
      description: 'Now go to your cart.',
      action: {
        label: <X size={15} />,
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  }

  return (
    <motion.div
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className=" w-fit flex justify-center items-center">
      <Button
        onClick={() => addToCart(product, personalisation)}
        variant="default"
        // disabled={stockLimitReached}
        className={`text-green-dark w-auto flex items-center justify-center hover:opacity-[unset]`}>
        Add to Cart
      </Button>
    </motion.div>
  );
};

export default AddToCartButton;
