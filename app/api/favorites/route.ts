import prisma from '@/lib/prismaClient';
import { auth } from '@clerk/nextjs/server';
// import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productId, productName } = await request.json();
    const { userId } = await auth();
    // const clerUser = await currentUser();
    // const userEmail = clerUser?.emailAddresses[0]?.emailAddress
    // const userName = clerUser?.firstName + ' ' + clerUser?.lastName;
    // console.log('clerUser', clerUser);

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 },
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 },
      );
    }

    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });

    // if (!user) {
    //   await prisma.user.create({
    //     data: {
    //       id: userId,
    //       name: userName,
    //     },
    //   });
    // }

    // const product = await prisma.item.findUnique({
    //   where: {
    //     id: productId,
    //   },
    // });

    // if (!product) {
    //   await prisma.item.create({
    //     data: {
    //       id: productId,
    //       title: productName,
    //     },
    //   });
    // }

    // const favoriteItem = await prisma.favorite.findUnique({
    //   where: {
    //     itemId_userId: {
    //       itemId: productId,
    //       userId: userId,
    //     },
    //   },
    // });

    // if (favoriteItem) {
    //   await prisma.favorite.delete({
    //     where: {
    //       itemId_userId: {
    //         itemId: productId,
    //         userId: userId,
    //       },
    //     },
    //   });
    //   return NextResponse.json(
    //     { message: 'Product removed from favorites' },
    //     { status: 200 },
    //   );
    // } else {
    //   await prisma.favorite.create({
    //     data: {
    //       itemId: productId,
    //       userId: userId,
    //     },
    //   });
    //   return NextResponse.json(
    //     { message: 'Product added to favorites' },
    //     { status: 200 },
    //   );
    // }

    // ===========

    let existingUserFavorites = await prisma.userFavorites.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!existingUserFavorites) {
      existingUserFavorites = await prisma.userFavorites.create({
        data: {
          userId: userId,
          productIds: [],
        },
      });
    }

    const isFavorited = existingUserFavorites.productIds.some(
      id => id === productId,
    );

    if (isFavorited) {
      //remove from favorites
      await prisma.userFavorites.update({
        where: {
          userId: userId,
        },
        data: {
          productIds: {
            set: existingUserFavorites.productIds.filter(
              id => id !== productId,
            ),
          },
        },
      });
      return NextResponse.json(
        { message: 'Product removed from favorites' },
        { status: 200 },
      );
    } else {
      // add to favorites

      await prisma.userFavorites.update({
        where: {
          userId: userId,
        },
        data: {
          productIds: {
            push: productId,
          },
        },
      });
      return NextResponse.json(
        { message: 'Product added to favorites' },
        { status: 200 },
      );
    }
  } catch (error) {
    console.log((error as Error).stack);

    return NextResponse.json(
      { error: 'Database operation failed', details: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function GET() {
  const { userId } = await auth();
  // console.log('userId---->', userId);

  try {
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 },
      );
    }

    const userFavorites = await prisma.userFavorites.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!userFavorites) {
      return NextResponse.json({ favorites: [] }, { status: 200 });
    }

    return NextResponse.json(
      { favorites: userFavorites.productIds },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 },
    );
  }
}
