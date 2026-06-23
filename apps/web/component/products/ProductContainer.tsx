'use client';
import React, { Suspense, useState } from 'react';
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
