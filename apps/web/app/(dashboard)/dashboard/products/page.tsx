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
  const productVariants = await getProductVariants();

  // const products = sanityData?.map((sbVariant: any) => {
  //   const match = supabaseData?.find(
  //     (supabaseVariant: any) =>
  //       supabaseVariant?.sku === (sbVariant?.sku as string),
  //   );
  //   return {
  //     ...sbVariant,
  //     ...match,
  //   };
  // });

  // console.log(variants);

  const products = supabaseData?.map((product: any) => {
    const sanityProduct = sanityData?.find((s: any) => s.sku === product.sku);
    const variants = productVariants?.filter(
      (variant: any) => variant.parent_sku === product.sku,
    );
    return {
      ...product,
      sanityId: sanityProduct?._id,
      variants,
    };
  });

  console.log('# --products-dash -->', products);

  return (
    <div className="w-full h-svh py-4 px-10 space-y-8">
      {/* Page Header */}

      <h1 className="text-[2.8rem] font-[500] text-orange-400">Products</h1>
      {/* <p className="text-gray-200">Manage and track all products</p> */}

      <ProductsContainer data={products} variants={productVariants} />
    </div>
  );
}
