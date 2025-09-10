'use client';
import { EsotericaStore, MusicStore } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Reference } from 'sanity';
import AddToCartButton from '../cart/add-to-cart-button/AddToCartButton';
// import { AddToFavoriteButton } from '../cart/add-to-favorite-button/AddToFavoriteButton.tsx';
import { useUser } from '@clerk/nextjs';
import FavoriteButton from '../cart/favoriteButton/FavoriteButton';
import { ProductsPrice } from './ProductsPrice';
import { useCart } from '@/hooks/useCart';
import SizeContainer from './SizeContainer';
import LocationAndTime from '../esoterica-components/LocationAndTime';

export const ProductThumb = ({
  product,
  bgColor,
  type = 'product',
  // favoritePdoucts,
}: {
  product: MusicStore | EsotericaStore | any;
  bgColor?: string;
  type?: string;
  // favoritePdoucts: FavoriteProducts[];
}) => {
  const { isSignedIn, isLoaded } = useUser();
  const [selectedSize, setselectedSize] = useState<string>('');
  const [isOpen, setisOpen] = useState(false);
  const { groupedItems } = useCart();

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

  // const isOutOfStock = product?.stock <= 0 && product?.stock != null
  const isOutOfStock = (product.stock ?? 0) <= 0;

  return (
    <article
      key={product._id}
      className={` relative p-3 flex flex-col justify-between ${bgColor} shadow-lg lg:max-w-[250px] rounded-lg ${isOutOfStock && product?.stock ? 'opacity-50' : ''}`}>
      {/* {isSignedIn && isLoaded && (
        <div className="absolute top-8 left-8">
          <FavoriteButton
            productId={product._id}
            productName={product.Name || product.heading}
            // initialIsFavorite={false}
          />
        </div>
      )} */}
      <div>
        <Link href={`/${type}/${product.slug?.current}`}>
          {product?.images && product?.images?.length > 0 && (
            <div className="rounded-lg ">
              <Image
                src={urlFor(product?.images?.[0] as Reference).url()}
                alt={product.Name || ''}
                className="w-full h-full  max-h-[12rem] object-cover  rounded-lg"
                width={600}
                height={600}
              />
            </div>
          )}
        </Link>
        <header className="grid gap-2 mt-2 justify-items-center">
          <h3 className="font-semibold">
            {product?.Name || product?.title || product?.heading}
          </h3>
          {product?.date ? (
            <LocationAndTime event={product} />
          ) : product?.desscription ? (
            <p className="text-sm line-clamp-2">{product?.description}</p>
          ) : null}

          {/* <p>Stock: {product.stock}</p> */}
          {product?.price ? <ProductsPrice product={product} /> : null}
          {product?.showSizes ? (
            <SizeContainer
              isOpen={isOpen}
              setisOpen={setisOpen}
              selectedSize={selectedSize}
              handleSizeSelect={handleSizeSelect}
              product={product}
            />
          ) : null}
        </header>
      </div>

      <div className="w-full flex justify-center mt-4">
        {product?.price ? (
          <AddToCartButton
            product={product as EsotericaStore | MusicStore}
            size={selectedSize}
          />
        ) : null}
      </div>
    </article>
  );
};
