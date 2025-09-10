// import { ProductsGrid } from '@/component/products/ProductsGridd
import { YouTubeChanel } from '@/component/musicStore-components/youtube/YouTubeChanel';
import { ProductsGrid } from '@/component/products/ProductsGrid';
import { SearchBar } from '@/component/search-bar/SearchBar';
import { EsotericaStore, MusicStore } from '@/sanity.types';
import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';
import { getSectionsControler } from '@/sanity/lib/sections/getSectionsControler';
import React from 'react';
import { GalleryPageProps } from '../gallery/page';
import GalleryContainer from '@/component/gallery/GalleryContainer';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const SearchPage = async ({
  // params,
  searchParams,
}: {
  // params: Params;
  searchParams: SearchParams;
}) => {
  const query = (await searchParams).query as string;

  const products = await searchProductsByName(query);
  const controlls = await getSectionsControler();

  const formattedEvents = products?.concerts?.map((event: any) => {
    const date = new Date(event?.date ?? '');
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'long' }).slice(0, 3);
    const year = date.getFullYear();
    const time = date.toLocaleString('default', {
      hour: 'numeric',
      minute: 'numeric',
    });

    return {
      ...event,
      day,
      month,
      year,
      time,
    };
  });

  // console.log('products', products);

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="section_wrapper_xl font-montserrat py-6 md:py-8">
        <header className="grid items-center mb-4 md:mb-8 justify-center md:text-[2rem]">
          <h1>Резултати за:</h1>
          <p className="text-center font-bold">{query}</p>
        </header>
        <div className="space-y-4 md:space-y-8">
          {formattedEvents?.length ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-montserrat">Концерти</h2>
              <ProductsGrid
                products={formattedEvents as any}
                type="concerts"
                bgColor="bg-secondaryPurple/15"
              />
            </div>
          ) : null}

          {products?.videos?.length ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-montserrat">Видео</h2>
              <div className="grid-container">
                {products?.videos?.map((track: any, index: number) => (
                  <YouTubeChanel
                    key={index + track?.url}
                    video={track?.url}
                    index={index}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {products?.gallery?.length ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-montserrat">Галерия</h2>
              <div className="grid-container">
                {products?.gallery?.map(
                  (category: GalleryPageProps, index: number) => (
                    <GalleryContainer
                      key={category._id}
                      data={category}
                      index={index}
                    />
                  ),
                )}
              </div>
            </div>
          ) : null}

          {/* {products?.products?.length &&
        controlls?.switchMusicProducts &&
        controlls?.switchEsotericaProducts ? (
          <div className="space-y-4">
          <h2 className="text-2xl  font-montserrat">Продукти</h2>
          <ProductsGrid
          products={products?.products as any}
          type="product"
          bgColor="bg-secondaryPurple/15"
          />
          </div>
        ) : null} */}
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
