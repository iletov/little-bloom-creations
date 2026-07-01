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
    <article className="flex flex-col sm:flex-row w-full border-b-[1px] rounded-md hover:bg-green-1/20 transition ease-in-out py-6 px-4 sm:px-6 gap-6 sm:gap-8 font-montserrat bg-white sm:bg-transparent shadow-sm sm:shadow-none mb-4 sm:mb-0">
      <Link
        href={{
          pathname: `/categories/${categorySlug}/${group.product.slug?.current || group.product.slug}`,
          query: { productId: group?.personalisation?.productId },
        }}
        className="flex gap-4 sm:gap-10 cursor-pointer sm:pr-4 flex-1">
        <div
          className="w-[100px] h-[130px] sm:w-[140px] sm:h-44 rounded-md overflow-hidden shrink-0 border border-slate-100"
          // onClick={redirectToProductPage}
        >
          {group.product.images?.[0] ? (
            <Image
              src={urlFor(group.product.images[0] as Reference).url()}
              alt={group.product.name || ''}
              width={140}
              height={140}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-3 min-w-0 flex-1">
          <p className="text-[1.6rem] sm:text-[1.8rem] font-semibold w-full text-start self-start leading-tight">
            {group.product.name}
          </p>

          <div className="text-[1.3rem] sm:text-[1.4rem] w-full text-start flex flex-col gap-1.5 text-slate-600">
            {/* Product Color */}
            {group.product?.color && (
              <span className="grid grid-cols-[110px_1fr] sm:flex sm:items-center gap-2 sm:gap-8">
                <span className="text-slate-400 font-medium">Цвят:</span>
                <ColorBadge color={group.product.color} size="sm" className="sm:ml-2" />
              </span>
            )}

            {/* Name */}
            {group?.personalisation?.name && (
              <span className="grid grid-cols-[110px_1fr] gap-2 sm:gap-8">
                <span className="text-slate-400 font-medium">Име:</span>
                <span className="uppercase font-medium text-slate-800 break-words">
                  {group?.personalisation?.name}
                </span>
              </span>
            )}

            {/* Text (Diary) */}
            {group?.personalisation?.addMainText && group?.personalisation?.addMainText !== 'no-text' && (
              <span className="grid grid-cols-[110px_1fr] gap-2 sm:gap-8">
                <span className="text-slate-400 font-medium">Текст:</span>
                <span
                  className={cn(
                    'capitalize font-medium text-slate-800 break-words',
                    group?.personalisation?.addMainText === 'italic' && 'italic',
                  )}>
                  {group?.personalisation?.addMainText}
                </span>
              </span>
            )}

            {/* Text Color (Diary) */}
            {group?.personalisation?.textColor && (
              <span className="grid grid-cols-[110px_1fr] gap-2 sm:gap-8 items-center">
                <span className="text-slate-400 font-medium leading-tight">Цвят на текста:</span>
                <span
                  className={cn(
                    'capitalize justify-self-start px-3 py-1 rounded-xl text-[1.2rem] font-medium tracking-wide shadow-sm',
                    group?.personalisation?.textColor === 'gold'
                      ? 'bg-yellow-400 text-yellow-950'
                      : 'bg-slate-400 text-white',
                  )}>
                  {group?.personalisation?.textColor}
                </span>
              </span>
            )}

            {/* Personalization Type (Blanket) */}
            {group?.personalisation?.personalizationType && group?.personalisation?.personalizationType !== 'none' && (
              <span className="grid grid-cols-[110px_1fr] gap-2 sm:gap-8">
                <span className="text-slate-400 font-medium leading-tight">Персонализация:</span>
                <span className="font-medium text-slate-800 break-words">
                  {group?.personalisation?.personalizationType === 'name-only' ? 'С име' : 'С име и бродерия'}
                </span>
              </span>
            )}

            {/* Embroidery (Blanket) */}
            {group?.personalisation?.embroideryImage?.alt && (
              <span className="grid grid-cols-[110px_1fr] gap-2 sm:gap-8">
                <span className="text-slate-400 font-medium">Бродерия:</span>
                <span className="font-medium text-green-dark break-words">
                  {group?.personalisation?.embroideryImage.alt}
                </span>
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-8 mt-4 pt-4 sm:mt-0 sm:pt-0 border-t sm:border-0 border-slate-100">
        <div className="flex items-center gap-4 sm:gap-8 shrink-0">
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
          className="text-[1.4rem] font-semibold text-center border-2 border-slate-200 px-6 py-2 rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto text-slate-700 whitespace-nowrap">
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
