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
import { ProductImageCarousel } from './ProductImageCarousel';
import { ProductFeatureIcons } from './ProductFeatureIcons';
import { PresentationGallery } from './PresentationGallery';
import { HowToOrderAccordion } from './HowToOrderAccordion';
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
      {/* 1.2fr означава, че лявата е малко по-голяма от дясната (1fr). други варианти напр. 60%_40% или 1.5fr_1fr */}
      <section className="grid md:grid-cols-[1.1fr_1fr] lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 pb-24 lg:pb-40">
        <div className="flex flex-col gap-6 w-full mx-auto md:mx-0">
          <ProductImageCarousel images={displayImages || []} alt={displayName || ''} />
          <ProductFeatureIcons features={data?.featureIcons} />
          <PresentationGallery images={data?.presentationGallery} />
        </div>
        <div className="bg-white rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-sm space-y-8 md:sticky md:top-36 self-start">
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
          {data?.howToOrder && <HowToOrderAccordion guide={data.howToOrder} />}
          {/* <AddToCartButton product={data} /> */}
        </div>
      </section>
    </>
  );
};

export default ProductContainer;
