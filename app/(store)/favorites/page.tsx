import { ProductsView } from '@/component/products/ProductsView';
import prisma from '@/lib/prismaClient';
import { EsotericaStore, MusicStore } from '@/sanity.types';
import { getSearchResults } from '@/sanity/lib/products/getSearchResults';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function FavoritesPage() {
  const { userId } = await auth();

  if (!userId) return redirect('/');

  const allProducts = await getSearchResults();

  try {
    const userFavorites = await prisma.userFavorites.findUnique({
      where: {
        userId: userId,
      },
    });

    const favoriteProducts = allProducts.filter(
      (product: MusicStore | EsotericaStore) =>
        userFavorites?.productIds.includes(product._id),
    );

    return (
      <section className=" favorites-bg_gradient ">
        <div className="section_wrapper min-h-[calc(100dvh-65px)]">
          {favoriteProducts.length === 0 ? (
            <h1 className="text-center flex items-center justify-center text-[4rem] py-[8rem] ">
              {' '}
              No Favorites yet{' '}
            </h1>
          ) : (
            <ProductsView products={favoriteProducts} />
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching favorites:', error);
  }
}
