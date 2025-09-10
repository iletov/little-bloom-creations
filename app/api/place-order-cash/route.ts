import { NextRequest, NextResponse } from 'next/server';
import { GroupedCartItem } from '../payment-intent/route';
import { backendClient } from '@/sanity/lib/backendClient';
import { CartItem } from '@/actions/checkQuantity';
import { userCheckout } from '@/lib/db/userCheckout';
import { select } from 'motion/react-client';

type UpdateProducts = {
  _id: string;
  quantity: number;
  stock: number;
  newStock: number;
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    //validation

    const itemsWithoutPrice = body?.cartItems.filter(
      (item: GroupedCartItem) => !item.product.price,
    );

    if (itemsWithoutPrice.length > 0) {
      return NextResponse.json(
        { error: "Some items don't have price" },
        { status: 400 },
      );
    }

    const productIds = body?.cartItems?.map(
      (item: CartItem) => item.product._id,
    );

    const findProductsById = await backendClient.fetch(
      `*[_type in ["musicStore", "esotericaStore"] && _id in $productIds]{
          _id,
          Name,
          stock
          }`,
      { productIds },
    );

    // console.log('findProductsById---->', findProductsById);

    if (!findProductsById || findProductsById.length === 0) {
      console.error('No products found');
      return NextResponse.json({ error: 'No products found' }, { status: 400 });
    }

    const productUpdates = findProductsById?.map((item: UpdateProducts) => {
      const cartItem = body.cartItems.find(
        (cartItem: CartItem) => cartItem.product._id === item._id,
      );

      return {
        _id: item._id,
        quantity: cartItem?.quantity,
        newStock: item?.stock - cartItem.quantity, // Reduce stock
      };
    });

    // console.log('productUpdates---->', productUpdates);

    const updatedProducts = await Promise.all(
      productUpdates.map((updatedProduct: UpdateProducts) =>
        backendClient
          .patch(updatedProduct._id)
          .set({ stock: updatedProduct.newStock })
          .commit(),
      ),
    );

    console.log('updated-SUCCESS---->', updatedProducts);

    const sanityProducts = body?.cartItems?.map((item: any) => ({
      _key: crypto.randomUUID(),
      product: {
        _type: 'reference',
        _ref: item.product._id,
      },
      // priceId: item.price?.id,
      quantity: item.quantity || 0,
      selectedSize: item.size || '',
      // priceAtPurchase: item.product.price,
      // productName: item.product.Name,
    }));

    // TODO: Add the user details to the database...

    await userCheckout(body);

    await backendClient.create({
      _type: 'order',
      orderNumber: body?.metadata.orderNumber,
      stripePaymentIntentId: undefined,
      customerDetails: {
        customerName: body?.metadata.customerName,
        customerEmail: body?.metadata.customerEmail,
        customerPhone: body?.orderDetails.phoneNumber,
      },
      stripeCustomerId: undefined,
      clerkUserId: body?.metadata.clerkUserId,
      currency: 'BGN',
      deliveryMethod: body?.orderMethods?.deliveryMethod,
      paymentMethod: body?.orderMethods?.paymentMethod,
      // amountDiscount: total_details?.amount_discount
      //   ? total_details.amount_discount / 100
      //   : 0,
      customerAddress: {
        country: body?.orderDetails.country,
        city: body?.orderDetails.city,
        officeCode: body?.orderDetails.officeCode,
        zip: body?.orderDetails.postalCode,
        street: body?.orderDetails.street,
        streetNumber: body?.orderDetails.streetNumber,
        other: body?.orderDetails.other,
      },
      products: sanityProducts,
      totalPrice: body?.amount ? body?.amount / 100 : 0,
      status: 'inProgress',
      orderDate: new Date().toISOString(),
    });

    return NextResponse.json(
      { orderNumber: body?.metadata.orderNumber },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error submiting cash order', error);
    return NextResponse.json(
      { error: 'Error submiting cash order' },
      { status: 500 },
    );
  }
};
