import { CartItem } from '@/app/store/features/cart/cartSlice';
import { userCheckout } from '@/lib/db/userCheckout';
import { backendClient } from '@/sanity/lib/backendClient';
import { NextRequest, NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string | undefined;
  clerkUserId: string;
};

export type GroupedCartItem = {
  product: CartItem['product'];
  quantity: number;
};

export const POST = async (req: NextRequest) => {
  const {
    cartItems,
    metadata,
    amount,
    orderDetails,
    orderMethods,
    existingPaymentIntentId,
  } = await req.json();

  console.log('SERVER - EXISTING PID----->', existingPaymentIntentId);
  console.log('====================');
  console.log('New TOTAL Amount', amount);
  console.log('====================');

  try {
    //validation

    const itemsWithoutPrice = cartItems.filter(
      (item: GroupedCartItem) => !item.product.price,
    );

    if (itemsWithoutPrice.length > 0) {
      return NextResponse.json(
        { error: "Some items don't have price" },
        { status: 400 },
      );
    }

    //Check the products stock and quantity

    const productIds = cartItems?.map(
      (item: GroupedCartItem) => item.product._id,
    );

    const products = await backendClient.fetch(
      `*[_type in ["musicStore", "esotericaStore"] && _id in $productIds]`,
      { productIds },
    );

    if (products.length !== productIds.length) {
      // console.log('Product not found');

      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const stockErrors: { id: string; name: string; stock: number }[] = [];

    for (const product of products) {
      const productId = product._id;
      // console.log('productId', productId);

      const cartItemsStock = cartItems?.find(
        (item: GroupedCartItem) => item?.product?._id === productId,
      );

      // console.log('INTET---->', products);
      // console.log('cartItemsStock---->', cartItemsStock);

      if (product?.stock < cartItemsStock?.quantity || product?.stock < 1) {
        stockErrors.push({
          id: productId,
          name: product.Name,
          stock: product.stock,
        });
      }
    }

    if (stockErrors.length > 0) {
      return NextResponse.json(
        {
          error: `Item(s) ${stockErrors
            .map(error => `${error.name} (Stock: ${error.stock})`)
            .join(', ')} have no stock or are less than your order quantity.`,
        },
        { status: 400 },
      );
    }
    // console.log('ERROR-------', stockErrors);

    if (stockErrors.length) return;

    // get/create customer

    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    //Check for existing payment intent and if neccessary update it

    if (existingPaymentIntentId) {
      try {
        const existingPaymentIntent = await stripe.paymentIntents.retrieve(
          existingPaymentIntentId,
        );

        if (
          existingPaymentIntent &&
          existingPaymentIntent.status === 'requires_payment_method'
        ) {
          const updatedPaymentIntent = await stripe.paymentIntents.update(
            existingPaymentIntentId,
            {
              amount: amount,
              metadata: metadata,
              receipt_email: metadata.customerEmail,
            },
          );

          return NextResponse.json({
            clientSecret: updatedPaymentIntent.client_secret,
            paymentIntentId: updatedPaymentIntent.id,
          });
        }
      } catch (error) {
        console.error('Error retrieving/updating payment intent:', error);
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'bgn',
      automatic_payment_methods: { enabled: true },
      customer: customerId,
      // customer_creation: customerId ? undefined : 'always',
      // customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata: metadata,
      // items: JSON.stringify(lineItems),
      receipt_email: metadata.customerEmail,
      description: `${metadata.orderNumber} for ${metadata.customerName}`,
    });

    // console.log('Payment intent created! ------->', paymentIntent.id);

    // Transform cart items with proper Sanity references
    const sanityProducts = cartItems?.map((item: any) => ({
      _key: crypto.randomUUID(),
      product: {
        _type: 'reference',
        _ref: item.product._id,
      },
      quantity: item.quantity || 0,
      selectedSize: item.size || '',
    }));

    //Save user data for ekont order
    const userData = {
      metadata: metadata,
      amount: amount,
      orderDetails: orderDetails,
      orderMethods: orderMethods,
    };
    await userCheckout(userData);

    await backendClient.create({
      _type: 'order',
      orderNumber: metadata.orderNumber,
      stripePaymentIntentId: paymentIntent.id,
      customerDetails: {
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        customerPhone: orderDetails.phoneNumber,
      },
      stripeCustomerId: undefined,
      clerkUserId: metadata.clerkUserId,
      currency: 'BGN',
      deliveryMethod: orderMethods?.deliveryMethod || '',
      paymentMethod: orderMethods?.paymentMethod || '',
      // amountDiscount: total_details?.amount_discount
      //   ? total_details.amount_discount / 100
      //   : 0,
      customerAddress: {
        country: orderDetails.country,
        city: orderDetails.city,
        officeCode: orderDetails.officeCode,
        zip: orderDetails.postalCode,
        street: orderDetails.street,
        streetNumber: orderDetails.streetNumber,
        other: orderDetails.other,
      },
      products: sanityProducts,
      totalPrice: amount ? amount / 100 : 0,
      status: 'pending',
      orderDate: new Date().toISOString(),
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 },
    );
  }
};
