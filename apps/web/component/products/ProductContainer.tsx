'use client';
import React, { Suspense, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Product, Variant } from './types';
import ProductFormFactory from './ProductFormFactory';
import { useCart } from '@/hooks/useCart';
import { ProductsPrice } from './ProductsPrice';
import ProductVariants from './ProductVariants';

interface ProductContainerProps {
  data: Product;
}

const ProductContainer = ({ data }: ProductContainerProps) => {
  const { variants } = useCart();
  const [addonPrice, setAddonPrice] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // console.log('ProductContainer DATA:', JSON.stringify(data, null, 2));

  const defaultVariant: Variant = {
    id: data.id || data.sku || 'default-id',
    sku: data.sku,
    product_id: data.id || data.sku,
    color: data.color || 'default',
    price: data.price,
    variant_name: data.name,
  };

  const variantsArray: Variant[] = [defaultVariant, ...(data.variants ?? [])];

  const selectedProduct = (): Variant | null => {
    if (variants && variantsArray.length > 0) {
      const selectedId = variants.id || variants.sku || variants.variant_sku;
      return (
        variantsArray.find((v: Variant) => {
          const vId = v.id || v.sku || v.variant_sku;
          return vId === selectedId;
        }) ?? null
      );
    }
    return null;
  };

  const product = selectedProduct();

  const displayName = product?.variant_name || data?.name;
  const displayImages = product?.images?.length ? product.images : data?.images;
  const finalPrice = product?.price ?? data?.price;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  return (
    <>
      <section className="grid md:grid-cols-2 gap-10 max-w-[1280px] pb-24 lg:pb-40">
        <div className="flex flex-col gap-6 self-start md:sticky md:top-36 w-full">
          <div className="aspect-square max-w-[50rem] w-full self-start rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white">
            {displayImages?.[activeImageIndex] && (
              <Image
                key={displayImages[activeImageIndex]?._key || activeImageIndex}
                src={urlFor(displayImages[activeImageIndex]).url()}
                alt={displayImages[activeImageIndex]?.alt ?? displayName}
                width={800}
                height={800}
                fetchPriority="high"
                priority={true}
                aria-label={displayName}
                loading="eager"
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
            )}
          </div>

          {/* Thumbnails Gallery */}
          {displayImages && displayImages.length > 1 && (
            <div className="flex flex-wrap gap-4 mt-2">
              {displayImages.map((img: any, index: number) => (
                <button
                  key={img?._key || index}
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    "relative w-24 h-24 rounded-xl overflow-hidden shadow-sm transition-all duration-200 border-2",
                    activeImageIndex === index 
                      ? "border-green-dark scale-105 opacity-100 ring-2 ring-green-dark/20" 
                      : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                  )}
                >
                  <Image
                    src={urlFor(img).width(200).height(200).url()}
                    alt={img?.alt ?? `${displayName} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className=" space-y-8">
          <header className="">
            <h1 className="text-[4rem]">{displayName}</h1>
            <PortableTextContainer data={data?.description} />
          </header>

          <div className="flex w-full">
            <div className="flex-1 flex items-center">
              <ProductsPrice
                price={finalPrice}
                className="[&>p]:text-[3.2rem] font-semibold text-green-dark"
              />
              {addonPrice > 0 && (
                <span className="text-[2rem] text-gray-500 font-medium ml-3">(+ {addonPrice} €)</span>
              )}
            </div>
            <div className="flex-1">
              <p>Select a variant</p>
              <div className="flex gap-4">
                {variantsArray.map((variant: Variant, index: number) => (
                  <ProductVariants variant={variant} key={variant?.id || variant?.sku || index} />
                ))}
              </div>
            </div>
          </div>

          <Suspense fallback={<div>Loading form...</div>}>
            <div className="flex flex-col gap-10">
              <ProductFormFactory product={data} onAddonPriceChange={setAddonPrice} />
            </div>
          </Suspense>
          {/* <AddToCartButton product={data} /> */}
        </div>
      </section>
    </>
  );
};

export default ProductContainer;
