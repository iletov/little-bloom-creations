// 'use server';

// import { CartItem } from '@/app/store/features/cart/cartSlice';
// import stripe from '@/lib/stripe';
// import { urlFor } from '@/sanity/lib/image';
// import { Reference } from 'sanity';

// //====================================
// //====================================

// //THIS IS OPTION 1 FOR CREATING CHECKOUT SESSIONS USING SERVER ACTIONS

// //====================================
// //====================================

// type Metadata = {
//   orderNumber: string;
//   customerName: string;
//   customerEmail: string;
//   supabaseUserId: string;
// };

// type GroupedCartItem = {
//   product: CartItem['product'];
//   quantity: number;
// };

// //test3

// export const createCheckoutSessions = async (
//   cartItems: GroupedCartItem[],
//   metadata: Metadata,
// ) => {
//   try {
//     const itemsWithoutPrice = cartItems.filter(item => !item.product.price);

//     if (itemsWithoutPrice.length > 0) {
//       throw new Error("Some items don't have price");
//     }

//     const customers = await stripe.customers.list({
//       email: metadata.customerEmail,
//       limit: 1,
//     });

//     let customerId: string | undefined;

//     if (customers.data.length > 0) {
//       customerId = customers.data[0].id;
//     }

//     const session = await stripe.checkout.sessions.create({
//       customer: customerId,
//       customer_creation: customerId ? undefined : 'always',
//       // customer_creation: "if_needed",
//       customer_email: !customerId ? metadata.customerEmail : undefined,
//       metadata,
//       mode: 'payment',
//       allow_promotion_codes: true,
//       // success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
//       // cancel_url: `${window.location.origin}/cart`,

//       success_url: `${process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL}/cart`,

//       line_items: cartItems.map(item => ({
//         price_data: {
//           currency: 'BGN',
//           unit_amount: Math.round(item.product.price! * 100),
//           product_data: {
//             name: item.product.Name || 'Unnamed Product',
//             description: `Product ID: ${item.product._id}`,
//             metadata: {
//               id: item.product._id,
//             },
//             images: item.product.image
//               ? [urlFor(item.product.image as Reference).url()]
//               : undefined,
//           },
//         },
//         quantity: item.quantity,
//       })),
//     });
//     return session.url;
//   } catch (error) {
//     console.error('Error creating checkout session', error);
//     throw error;
//   }
// };
