// import Stripe from 'stripe';

// export const cleanUpPaymentIntents = async (stripe: Stripe) => {
//   try {
//     console.log('Running payment intent cleanup job...');

//     const thirtyMinutesAgo = Math.floor(Date.now() / 1000) - 30 * 60;

//     const searchForPaymentIntents = await stripe.paymentIntents.list({
//       created: { lt: thirtyMinutesAgo },
//       limit: 100,
//     });

//     const incompletePaymentIntents = searchForPaymentIntents.data.filter(
//       (intent: Stripe.PaymentIntent) =>
//         intent.status === 'requires_payment_method',
//     );

//     console.log(
//       `--- Found ${incompletePaymentIntents.length} abandoned payment intents---`,
//     );

//     // Cancel each payment intent
//     let canceledCount = 0;
//     for (const paymentIntent of incompletePaymentIntents) {
//       try {
//         await stripe.paymentIntents.cancel(paymentIntent.id);
//         canceledCount++;
//         console.log('Payment Intent Canceled:', paymentIntent.id);
//       } catch (error) {
//         console.error(
//           `Error canceling payment intent ${paymentIntent.id}:`,
//           error,
//         );
//       }
//     }

//     console.log(`Successfully canceled ${canceledCount} payment intents`);
//   } catch (error) {
//     console.error('Error cleaning up payment intents:', error);
//   }
// };
