'use client';
import React, { useEffect, useState } from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import ProductForm, { Variant } from './ProductForm';
import { useCart } from '@/hooks/useCart';
import { ProductsPrice } from './ProductsPrice';
import ProductVariants from './ProductVariants';

const ProductContainer = ({ data }: any) => {
  const { variants } = useCart();

  const selectedProduct = () => {
    if (variants && data?.variants) {
      return data?.variants?.find(
        (variant: Variant) => variant.id === variants.id,
      );
    }
    return null;
  };

  const product = selectedProduct();

  const displayName = product?.variant_name || data?.name;

  const displayImages = product?.images?.length ? product.images : data?.images;

  const finalPrice = product ? product.price : data?.price;

  const defaultVariant = { id: data?.id };

  const variantsArray = data?.variants.map((variant: Variant) => variant) || [];
  variantsArray.unshift(defaultVariant);

  return (
    <>
      <section className="grid md:grid-cols-2 gap-10 max-w-[1280px]">
        <div className="grid justify-center items-start">
          <div className="aspect-square max-w-[50rem] w-full self-start">
            {displayImages?.[0] && (
              <Image
                src={urlFor(displayImages?.[0] ?? null).url()}
                alt={displayImages?.[0]?.alt ?? ''}
                width={400}
                height={400}
                fetchPriority="high"
                priority={true}
                aria-label={displayName}
                loading="eager"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* TODO: Add all images */}
          {/* TODO: Add different variants */}
        </div>
        <div className=" space-y-8">
          <header className="">
            <h1 className="text-[4rem]">{displayName}</h1>
            <PortableTextContainer data={data?.description} />
          </header>

          <div className="flex w-full">
            <ProductsPrice
              price={finalPrice}
              className="flex-1 [&>p]:text-[3.2rem] font-semibold text-green-dark"
            />
            <div className="flex-1">
              <p>Select a variant</p>
              <div className="flex gap-4">
                {variantsArray.map((variant: Variant, index: number) => (
                  <ProductVariants variant={variant} key={variant?.id} />
                ))}
              </div>
            </div>
          </div>

          <ProductForm product={data} />
          {/* <AddToCartButton product={data} /> */}
        </div>
      </section>
    </>
  );
};

export default ProductContainer;
