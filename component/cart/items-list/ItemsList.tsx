import { EsotericaStore, MusicStore } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Reference } from 'sanity';
import AddToCartButton from '../add-to-cart-button/AddToCartButton';
import { Pencil } from 'lucide-react';
import { calculateDiscountAmount } from '@/lib/discountamount';
import { ProductsPrice } from '@/component/products/ProductsPrice';

type ItemsListProps = {
  group: {
    product: EsotericaStore | MusicStore;
    quantity: number;
    size?: string;
  };
  checkout?: boolean;
};

export const ItemsList = ({ group, checkout }: ItemsListProps) => {
  const router = useRouter();

  const redirectToProductPage = () => {
    router.push(`/product/${group.product.slug?.current}`);
  };

  return (
    <article
      key={group.product._id}
      className=" flex w-full border-b-[1px] rounded-md  py-4 px-4 mt-5 gap-5 font-montserrat">
      <div className="flex gap-5 cursor-pointer pr-4 hover:opacity-75 transition easy-in-out flex-[1]">
        <div
          className="min-w-24 h-28 rounded-md overflow-hidden"
          onClick={redirectToProductPage}>
          <Image
            src={urlFor(group.product.images?.[0] as Reference).url()}
            alt={group.product.Name || ''}
            width={100}
            height={100}
            className="w-full h-full object-fill"
          />
        </div>
        <div>
          <div
            className="md:font-semibold space-y-2"
            onClick={redirectToProductPage}>
            <p>{group.product.Name}</p>
            <p>{group.size}</p>
          </div>
          <div className="md:hidden">
            <PriceItem group={group} checkout={checkout} />
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <PriceItem group={group} checkout={checkout} />
      </div>
    </article>
  );
};

const PriceItem = ({ group, checkout }: ItemsListProps) => {
  const router = useRouter();
  return (
    <>
      {!checkout ? (
        <span className="flex-[.6] flex flex-col items-end">
          <AddToCartButton
            product={group.product as MusicStore | EsotericaStore}
            cartItem={group}
          />
          <div className="px-2">
            <ProductsPrice product={group.product} />
          </div>
        </span>
      ) : (
        <div className="w-auto flex gap-3 mx-2 ">
          <p className="font-play">{group.quantity}</p>
          <p
            onClick={() => router.back()}
            className="cursor-pointer flex items-center gap-1 text-[0.75rem] text-lightBlue hover:text-lightBlue/80 transition-all font-comfortaa">
            <Pencil size={12} />
            Промени
          </p>
        </div>
      )}
    </>
  );
};
