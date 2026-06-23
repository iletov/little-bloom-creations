'use client';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Reference } from 'sanity';
import { Pencil, X } from 'lucide-react';
import { ProductsPrice } from '@/component/products/ProductsPrice';
import Link from 'next/link';
import ClearCartButton from '../clear-cart-button/ClearCartButton';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { ColorBadge } from '@/component/products/ColorBadge';

type ItemsListProps = {
  group: {
    product: any;
    quantity: number;
    // cartId: string;
    personalisation?: {
      productId: string;
      addMainText?: string;
      textColor?: string;
      name?: string;
      addonPrice?: number;
      personalizationType?: string;
      embroideryImage?: { alt?: string; [key: string]: any };
    };
  };
  checkout?: boolean;
};

export const ItemsList = ({ group, checkout }: ItemsListProps) => {
  const categorySlug = group.product?.category?.slug?.current 
    || (typeof group.product?.category === 'string' ? group.product.category : 'all');

  return (
    <article className=" flex w-full border-b-[1px] rounded-md hover:bg-green-1/20 transition easy-in-out py-4 px-4 gap-8 font-montserrat">
      <Link
        href={{
          pathname: `/categories/${categorySlug}/${group.product.slug?.current || group.product.slug}`,
          query: { productId: group?.personalisation?.productId },
        }}
        className="flex gap-10 cursor-pointer pr-4  flex-1">
        <div
          className="w-auto h-44 rounded-md overflow-hidden"
          // onClick={redirectToProductPage}
        >
          {group.product.images?.[0] ? (
            <Image
              src={urlFor(group.product.images[0] as Reference).url()}
              alt={group.product.name || ''}
              width={120}
              height={120}
              className="w-full h-full object-fill"
            />
          ) : (
            <div className="w-[120px] h-[120px] bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[1.6rem] font-semibold w-full text-start self-start ">
            {group.product.name}
          </p>

          <div className="text-[1.4rem] w-full text-start grid gap-1">
            {/* Product Color */}
            {group.product?.color && (
              <span className="flex items-center gap-8">
                Цвят:
                <ColorBadge color={group.product.color} size="sm" className="ml-2" />
              </span>
            )}

            {/* Name */}
            {group?.personalisation?.name && (
              <span className="grid grid-cols-2 gap-8">
                Име:
                <span className="uppercase justify-self-start">
                  {group?.personalisation?.name}
                </span>
              </span>
            )}

            {/* Text (Diary) */}
            {group?.personalisation?.addMainText && group?.personalisation?.addMainText !== 'no-text' && (
              <span className="grid grid-cols-2 gap-8">
                Текст:
                <span
                  className={cn(
                    'capitalize justify-self-start',
                    group?.personalisation?.addMainText === 'italic' && 'italic',
                  )}>
                  {group?.personalisation?.addMainText}
                </span>
              </span>
            )}

            {/* Text Color (Diary) */}
            {group?.personalisation?.textColor && (
              <span className="grid grid-cols-2 gap-8">
                Цвят на текста:
                <span
                  className={cn(
                    'capitalize justify-self-start ml-1 px-5 py-[0.5px] rounded-xl',
                    group?.personalisation?.textColor === 'gold'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-slate-400 text-white',
                  )}>
                  {group?.personalisation?.textColor}
                </span>
              </span>
            )}

            {/* Personalization Type (Blanket) */}
            {group?.personalisation?.personalizationType && group?.personalisation?.personalizationType !== 'none' && (
              <span className="grid grid-cols-2 gap-8">
                Персонализация:
                <span className="justify-self-start">
                  {group?.personalisation?.personalizationType === 'name-only' ? 'С име' : 'С име и бродерия'}
                </span>
              </span>
            )}

            {/* Embroidery (Blanket) */}
            {group?.personalisation?.embroideryImage?.alt && (
              <span className="grid grid-cols-2 gap-8">
                Бродерия:
                <span className="justify-self-start text-green-dark">
                  {group?.personalisation?.embroideryImage.alt}
                </span>
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="flex flex-col gap-8">
        <div className="flex gap-8">
          <PriceItem group={group} checkout={checkout} />
          <ClearCartButton
            productId={group?.personalisation?.productId as string}
            className={cn(checkout && 'self-center')}
          />
        </div>
        <Link
          href={{
            pathname: `/categories/${categorySlug}/${group.product.slug?.current || group.product.slug}`,
          }}
          className="text-[1.4rem] border-2 px-4 py-2 rounded-lg hover:bg-white self-start">
          {' '}
          Add new item
        </Link>
      </div>
    </article>
  );
};

const PriceItem = ({ group, checkout }: ItemsListProps) => {
  const router = useRouter();

  const basePrice = group?.product?.variant_price
    ? group.product.variant_price
    : group.product.price;
  
  const addonPrice = group?.personalisation?.addonPrice || 0;
  const finalPrice = basePrice + addonPrice;

  return (
    <>
      {!checkout ? (
        <span className=" flex flex-col items-end">
          {/* <AddToCartButton product={group?.product as any} cartItem={group} /> */}
          <div className="px-2 flex items-center gap-2">
            <ProductsPrice price={basePrice} />
            {addonPrice > 0 && <span className="text-gray-500 text-[1.4rem]">(+ {addonPrice} €)</span>}
          </div>
        </span>
      ) : (
        <div className="w-auto flex gap-8 mx-2 ">
          <p className="font-play flex gap-1.5 items-center">
            <span className="">
              <X size={10} className="self-center" />
            </span>{' '}
            {group.quantity}
          </p>
          <p
            onClick={() => router.back()}
            className="cursor-pointer flex items-center gap-2 text-[1.4rem] text-lightBlue hover:text-lightBlue/80 transition-all font-comfortaa">
            <Pencil size={14} />
            Промени
          </p>
        </div>
      )}
    </>
  );
};
