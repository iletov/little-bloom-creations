import React from 'react';
import { notFound } from 'next/navigation';
import {
  getAllCategories,
  getAllProductsSanity,
  getPageData,
} from '@/sanity/lib/fetch/fetchData';
import SectionRenderer from '@/component/section-renderer/SectionRenderer';
import { ShopClient } from './ShopClient';


export const revalidate = 1800;

export default async function ShopPage() {
  const page = await getPageData('shop');
  const products = await getAllProductsSanity();
  const categories = await getAllCategories();

  return (
    <>
      <section>
        {page?.sections && <SectionRenderer sections={page.sections} />}
      </section>
      
      <section className="fhd:px-[unset] section-y-padding bg-pink-1/30 min-h-screen">
        <div className="section_wrapper">
          <ShopClient products={products} categories={categories} />
        </div>
      </section>
    </>
  );
}
