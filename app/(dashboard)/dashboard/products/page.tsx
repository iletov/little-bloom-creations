import ProductsContainer from '@/component/dashboard/products-container/ProductsContainer';
import {
  getAllProductsSanity,
  getProducts,
} from '@/sanity/lib/fetch/fetchData';
import {
  getAllProducts,
  getProductVariants,
} from '@/supabase/lib/getAllProducts';
import React from 'react';

export default async function Products() {
  const sanityData = await getAllProductsSanity();
  const supabaseData = await getAllProducts();
  const variants = await getProductVariants();

  const products = sanityData?.map((sbVariant: any) => {
    const match = supabaseData?.find(
      (supabaseVariant: any) =>
        supabaseVariant?.sku === (sbVariant?.sku as string),
    );
    return {
      ...sbVariant,
      ...match,
    };
  });

  // console.log(variants);

  // const products = supabaseData?.map((product: any) => {
  //   const variant = variants?.filter(
  //     (variant: any) => variant.parent_sku === product.sku,
  //   );
  //   return {
  //     ...product,
  //     variant,
  //   };
  // });

  console.log('# --products-dash -->', products);

  return (
    <div className="w-full h-svh py-8 px-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-gray-500">Manage and track all products</p>
      </div>
      <ProductsContainer data={products} variants={variants} />
    </div>
  );
}
