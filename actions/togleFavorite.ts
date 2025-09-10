'use server';

import { backendClient } from '@/sanity/lib/backendClient';
import { getFavoriteProducts } from '@/sanity/lib/favorites/getFavoriteProducts';
import { auth, currentUser } from '@clerk/nextjs/server';

export const toggleFavorite = async (itemId: string) => {
  const { userId } = await auth();
  const user = await currentUser();
  // console.log('userId----', user?.emailAddresses[0]?.emailAddress);
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!userId) {
    throw new Error('User must be authenticated');
  }

  // const existingFavorite = await getFavoriteProducts(userId);

  const existingFavorite = await backendClient.fetch(
    `*[_type == "favoriteProducts" && userId == $userId][0]`,
    { userId },
  );

  // console.log('----if Exist----', existingFavorite);

  if (!existingFavorite) {
    await backendClient.create({
      _type: 'favoriteProducts',
      userId,
      userEmail,
      itemId: [
        {
          _key: crypto.randomUUID(),
          _type: 'reference',
          _ref: itemId,
        },
      ],
      createdAt: new Date().toISOString(),
    });
    return true;
  }

  // console.log('----EXISTING ITEM----', existingFavorite);

  const isAlreadyFavorited = existingFavorite.itemId?.some(
    (item: { _ref: string }) => item._ref === itemId,
  );

  // console.log('----FAVORITED---', isAlreadyFavorited);

  if (!isAlreadyFavorited) {
    await backendClient
      .patch(existingFavorite._id)
      .insert('after', 'itemId[-1]', [
        {
          _key: crypto.randomUUID(),
          _type: 'reference',
          _ref: itemId,
        },
      ])
      .commit();
    return true;
  }

  if (isAlreadyFavorited) {
    // console.log('----ALL READY ADDED---', isAlreadyFavorited);

    await backendClient
      .patch(existingFavorite._id)
      .unset([`itemId[_ref=="${itemId}"]`])
      .commit();

    return false;
  }
};
