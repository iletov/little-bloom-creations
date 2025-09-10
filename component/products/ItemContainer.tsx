'use client';
import React, { useEffect, useState } from 'react';
import { ProductsPrice } from './ProductsPrice';
import AddToCartButton from '../cart/add-to-cart-button/AddToCartButton';
import { VideoComponent } from '../video-component/VideoComponent';
import { PortableText } from 'next-sanity';
import { EsotericaStore, MusicStore } from '@/sanity.types';
import { ProductImagesContainer } from './ProductImagesContainer';
import { useCart } from '@/hooks/useCart';
import SizeContainer from './SizeContainer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FavoriteButton from '../cart/favoriteButton/FavoriteButton';
import { useUser } from '@clerk/nextjs';
import { Separator } from '../separator/Separator';
import { AlertBox } from '../modals/AlertBox';
import { redirect } from 'next/navigation';
// import { VideoComponentAspect } from '../video-component/VideoComponentAspect';
const ItemContainer = ({
  product,
}: {
  product: MusicStore | EsotericaStore;
}) => {
  const { isSignedIn, isLoaded } = useUser();
  const { groupedItems, addItem } = useCart();
  const [selectedSize, setselectedSize] = useState<string>('');
  const [isOpen, setisOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const itemSize = groupedItems.find(
      item => item.product._id === product._id,
    );
    if (itemSize && itemSize.size) {
      setselectedSize(itemSize.size);
    }
  }, []);

  const handleSizeSelect = (size: string) => {
    setselectedSize(size);
    setisOpen(false);
  };

  const isOutOfStock = (product?.stock ?? 0) <= 0;

  const onAddItem = () => {
    const needsSize = product?.showSizes;
    if (!needsSize) {
      addItem({ ...product, size: selectedSize || '' });
      redirect('/cart');
    }
    if (needsSize) {
      if (!selectedSize) {
        setShowAlert(true);
      } else {
        addItem({ ...product, size: selectedSize || '' });
        redirect('/cart');
      }
    }
  };

  return (
    <div
      className={`${isOutOfStock ? 'opacity-50' : ''} block sm:flex gap-8 md:gap-20 font-montserrat`}>
      <ProductImagesContainer product={product} />

      {/* HEADING AND DESCRIPTION */}
      <div className="w-full  md:w-[75%] space-y-4 ">
        <header className="prose ">
          <h1 className="text-foreground font-montserrat text-[36px]">
            {product?.Name}
          </h1>
        </header>
        {product?.showSizes ? (
          <div className="w-full">
            <SizeContainer
              isOpen={isOpen}
              setisOpen={setisOpen}
              selectedSize={selectedSize}
              handleSizeSelect={handleSizeSelect}
              product={product}
            />
          </div>
        ) : null}

        <ProductsPrice
          priceTag={'PRICE'}
          product={product}
          className="text-[1.5rem] font-play"
        />
        <div className="flex  w-full justify-center pb-2">
          <AddToCartButton
            product={product}
            disable={isOutOfStock}
            size={selectedSize}
          />
        </div>
        {/* <Link href={'/cart'} className="w-full"> */}
        <Button
          variant={'default'}
          onClick={onAddItem}
          className="w-full  bg-primaryPurple/80 hover:bg-secondaryPurple/60 text-mango font-montserrat ">
          Поръчай
        </Button>
        {/* </Link> */}
        {isSignedIn && isLoaded && (
          <div className="flex w-full justify-center">
            <FavoriteButton
              productId={product?._id}
              productName={product?.Name}
              // initialIsFavorite={false}
            />
          </div>
        )}
        <Separator className=" w-full bg-mango" />
        <div className="prose text-foreground font-comfortaa">
          {Array.isArray(product?.description) && (
            <PortableText value={product?.description} />
          )}
        </div>
      </div>
      {showAlert && (
        <AlertBox
          title="Моля, изберете размер"
          description="Необходимо е да изберете размер, за да добавите продукт в кошницата."
          reset={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default ItemContainer;
