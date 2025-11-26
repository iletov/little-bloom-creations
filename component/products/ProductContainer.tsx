import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import ProductForm from './ProductForm';

const ProductContainer = ({ data }: any) => {
  return (
    <section className="grid md:grid-cols-2 gap-10">
      <div className="self-start justify-self-center">
        <div className="aspect-square max-w-[30rem]">
          <Image
            src={urlFor(data?.images[0]).url()}
            alt={data?.name}
            width={300}
            height={300}
            fetchPriority="high"
            priority={true}
            aria-label={data?.name}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className=" space-y-8">
        <header className="">
          <h1 className="text-[4rem]">{data?.name}</h1>
          <PortableTextContainer data={data?.description} />
        </header>

        <ProductForm product={data} />
        {/* <AddToCartButton product={data} /> */}
      </div>
    </section>
  );
};

export default ProductContainer;
