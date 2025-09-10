'use client';
import { AlertBox } from '@/component/modals/AlertBox';
import { useCart } from '@/hooks/useCart';
import { EsotericaStore, MusicStore } from '@/sanity.types';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  product: MusicStore | EsotericaStore;
  disable?: boolean;
  size?: string | undefined;
  cartItem?: {
    product: EsotericaStore | MusicStore;
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

  const { addItem, removeItem, getItemCount } = useCart();

  const [isClient, setIsClient] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const productId = cartItem ? cartItem.product._id : product._id;
  const effectiveProduct = cartItem ? cartItem.product : product;
  const effectiveSize = cartItem ? cartItem.size : size || '';
  const itemCounnt = getItemCount(productId, effectiveSize);
  const stockLimitReached = itemCounnt > (effectiveProduct.stock ?? 0) - 1;

  useEffect(() => {
    setIsClient(true);
    if (stockLimitReached) {
      toast('Sorry, we are out of stock!', {
        description: 'This product is currently out of stock.',
        action: {
          label: <X size={15} />,
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  }, [stockLimitReached]);

  if (!isClient) return null;

  const onAddItem = () => {
    if (cartItem) {
      addItem({ ...cartItem.product, size: cartItem.size });
    } else {
      const needsSize = effectiveProduct.showSizes;
      if (!needsSize) {
        addItem({ ...effectiveProduct, size: effectiveSize || '' });
      }
      if (product?.showSizes) {
        if (!effectiveSize) {
          setShowAlert(true);
        } else {
          addItem({ ...effectiveProduct, size: effectiveSize });
        }
      }
    }
  };

  // const onRemoveItem = () => {
  //   removeItem({
  //     productId: product._id,
  //     size: effectiveSize
  //   });
  // };

  return (
    <section className="flex items-center gap-2 w-fit">
      <button
        onClick={() => removeItem(productId, effectiveSize)}
        className={` py-1 w-10 h-8 flex items-center justify-center transition-colors duration-300  `}
        disabled={itemCounnt === 0}>
        <span className={`text-xl text-white`}>-</span>
      </button>

      <span className="text-[1.075rem]">{itemCounnt}</span>

      <button
        // onClick={() => addItem(product as MusicStore)}
        onClick={onAddItem}
        disabled={stockLimitReached}
        className={` py-1  w-10 h-8 flex items-center justify-center transition-colors duration-300  `}>
        <span className={`text-xl text-white `}>+</span>
      </button>
      {showAlert && (
        <AlertBox
          title="Моля, изберете размер"
          description="Необходимо е да изберете размер, за да добавите продукт в кошницата."
          reset={() => setShowAlert(false)}
        />
      )}
    </section>
  );
};

export default AddToCartButton;
