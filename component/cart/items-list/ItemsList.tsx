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

type ItemsListProps = {
  group: {
    product: any;
    quantity: number;
    // cartId: string;
    personalisation?: {
      productId: string;
      addMainText: string;
      textColor: string;
      name: string;
    };
  };
  checkout?: boolean;
};

export const ItemsList = ({ group, checkout }: ItemsListProps) => {
  return (
    <article className=" flex w-full border-b-[1px] rounded-md hover:bg-green-1/20 transition easy-in-out py-4 px-4 gap-8 font-montserrat">
      <Link
        href={{
          pathname: `/product/${group.product.slug?.current}`,
          query: { productId: group?.personalisation?.productId },
        }}
        className="flex gap-10 cursor-pointer pr-4  flex-1">
        <div
          className="w-auto h-44 rounded-md overflow-hidden"
          // onClick={redirectToProductPage}
        >
          <Image
            src={urlFor(group.product.images?.[0] as Reference).url()}
            alt={group.product.name || ''}
            width={120}
            height={120}
            className="w-full h-full object-fill"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[1.6rem] font-semibold w-full text-start self-start ">
            {group.product.name}
          </p>

          <div className="text-[1.4rem] w-full text-start grid gap-1">
            <p className="grid grid-cols-2 gap-8">
              Текст:{' '}
              <span
                className={cn(
                  'capitalize justify-self-start',
                  group?.personalisation?.addMainText === 'italic' && 'italic',
                )}>
                {group?.personalisation?.addMainText
                  ? group?.personalisation?.addMainText
                  : 'No Text'}
              </span>
            </p>
            <span className="grid grid-cols-2 gap-8">
              Име:{' '}
              <span className="uppercase justify-self-start">
                {group?.personalisation?.name}
              </span>
            </span>
            <span className="grid grid-cols-2 gap-8">
              Цвят:
              <span
                className={cn(
                  'cacpitalize justify-self-start ml-1 px-5 py-[0.5px] rounded-xl',
                  group?.personalisation?.textColor === 'gold'
                    ? 'bg-yellow-400'
                    : 'bg-slate-400 text-white',
                )}>
                {group?.personalisation?.textColor}
              </span>
            </span>
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
            pathname: `/product/${group.product.slug?.current}`,
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
  return (
    <>
      {!checkout ? (
        <span className=" flex flex-col items-end">
          {/* <AddToCartButton product={group?.product as any} cartItem={group} /> */}
          <div className="px-2">
            <ProductsPrice product={group.product} />
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
