// import { EsotericaStore, MusicStore } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Reference } from 'sanity';
import AddToCartButton from '../add-to-cart-button/AddToCartButton';
import { Pencil } from 'lucide-react';
import { calculateDiscountAmount } from '@/lib/discountamount';
import { ProductsPrice } from '@/component/products/ProductsPrice';
import Link from 'next/link';
import ClearCartButton from '../clear-cart-button/ClearCartButton';

type ItemsListProps = {
  group: {
    product: any;
    quantity: number;
    cartId: string;
  };
  checkout?: boolean;
};

export const ItemsList = ({ group, checkout }: ItemsListProps) => {
  return (
    <article className=" flex w-full border-b-[1px] rounded-md hover:bg-green-1/20 transition easy-in-out py-4 px-4 gap-5 font-montserrat">
      <Link
        href={`/product/${group.product.slug?.current}`}
        className="flex gap-5 cursor-pointer pr-4  flex-1">
        <div
          className="min-w-24 h-28 rounded-md overflow-hidden"
          // onClick={redirectToProductPage}
        >
          <Image
            src={urlFor(group.product.images?.[0] as Reference).url()}
            alt={group.product.name || ''}
            width={100}
            height={100}
            className="w-full h-full object-fill"
          />
        </div>

        <p className="text-[1.6rem] font-semibold space-y-2 w-full text-start self-start ">
          {group.product.name}
        </p>
      </Link>
      <PriceItem group={group} checkout={checkout} />
      <ClearCartButton cartId={group?.cartId} className="" />
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
        <div className="w-auto flex gap-3 mx-2 ">
          <p className="font-play">{group.quantity}</p>
          <p
            onClick={() => router.back()}
            className="cursor-pointer flex items-center gap-1 text-[1.2rem] text-lightBlue hover:text-lightBlue/80 transition-all font-comfortaa">
            <Pencil size={12} />
            Промени
          </p>
        </div>
      )}
    </>
  );
};
