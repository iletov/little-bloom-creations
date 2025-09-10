import ItemContainer from '@/component/products/ItemContainer';
import { EsotericaStore, MusicStore } from '@/sanity.types';
import { getTemplatePages } from '@/sanity/lib/getTemplatePages';
import { getProductBySlug } from '@/sanity/lib/products/getProductBySlug';
import { notFound } from 'next/navigation';
import React from 'react';

const _type = ['musicStore', 'esotericaStore'];

export async function generateStaticParams() {
  const template = await getTemplatePages(_type);
  return template?.map((page: { slug: { current: string } }) => ({
    slug: page.slug.current || [],
  }));
}

export const dynamicParams = true;
export const revalidate = 1800;

// redirect(notFound());

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const getCachedProductFunction = getProductBySlug(slug);
  const product = (await getCachedProductFunction(slug)) as
    | MusicStore
    | EsotericaStore
    | null;

  // const controllers = await getSectionsControler();

  // const { pageData } = await getMainPageData('template', controllers);

  if (!product) return notFound();

  return (
    <section className="product-bg_gradient py-8 md:py-12">
      <div
        className={`section_wrapper_sm text-foreground space-y-[20px] md:space-y-[80px] `}>
        <ItemContainer product={product} />
        {/* {pageData?.switchEsotericaProducts || pageData?.switchMusicProducts ? (
          <ProductsView
            // products={products}
            products={[
              ...((pageData?.switchEsotericaProducts &&
                pageData?.esotericaProducts?.filter(Boolean)) ||
                []),
              ...((pageData?.switchMusicProducts &&
                pageData?.musicProducts?.filter(Boolean)) ||
                []),
            ]}
            bgColor="bg-secondaryPurple/15"
            heading={
              pageData?.musicProductsHeading?.heading ||
              pageData?.esotericaProductsHeading?.heading
            }
          />
        ) : null} */}
      </div>
    </section>
  );
}
