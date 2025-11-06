'use client';
import { AlertBox } from '@/component/modals/AlertBox';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
// import { EsotericaStore, MusicStore } from '@/sanity.types';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CartIcon } from '@/component/icons/icons';

interface AddToCartButtonProps {
  product: any;
  disable?: boolean;
  size?: string | undefined;
  cartItem?: {
    product: any;
    quantity: number;
    size?: string;
  };
}

const AddToCartButton = ({
  product,
  disable,
  size,
  cartItem,
}: AddToCartButtonProps) => {
  // console.log(product);

  const { addItem } = useCart();

  // console.log('TOTAL ITEMS IN CART', totalItems);

  // const [isClient, setIsClient] = useState(false);

  // const productId = cartItem ? cartItem.product._id : product._id;
  // const effectiveProduct = cartItem ? cartItem.product : product;
  // const effectiveSize = cartItem ? cartItem.size : size || '';
  // const itemCounnt = getItemCount(productId, effectiveSize);
  // const stockLimitReached = itemCounnt > (effectiveProduct.stock ?? 0) - 1;

  // useEffect(() => {
  //   setIsClient(true);
  //   if (stockLimitReached) {
  //     toast('Sorry, we are out of stock!', {
  //       description: 'This product is currently out of stock.',
  //       action: {
  //         label: <X size={15} />,
  //         onClick: () => {
  //           toast.dismiss();
  //         },
  //       },
  //     });
  //   }
  // }, [stockLimitReached]);

  // if (!isClient) return null;

  function addToCart(item: string) {
    addItem(item);
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
        onClick={() => addToCart(product)}
        variant="default"
        // disabled={stockLimitReached}
        className={`text-green-dark w-auto flex items-center justify-center hover:opacity-[unset]`}>
        Add to Cart
      </Button>
    </motion.div>
  );
};

export default AddToCartButton;
