'use client';
import { useCart } from '@/hooks/useCart';
import { Elements } from '@stripe/react-stripe-js';
import React, { useMemo } from 'react';
import { CheckoutComponent } from '../checkout-component/CheckoutComponent';
import stripePromise from '@/lib/stripePromise';

export const CardPayment = ({ paymentMethod }: { paymentMethod: string }) => {
  const { totalPrice, clientSecret } = useCart();

  const optionsElements = useMemo(() => {
    return {
      clientSecret: clientSecret || '',
      appearance: {
        theme: 'stripe' as const,
      },
    };
  }, [clientSecret]);

  if (!clientSecret) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Preparing payment form...</p>
        <div className="mt-4 animate-pulse flex justify-center">
          <div className="h-6 w-[12rem] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-5 md:my-10">
      <Elements stripe={stripePromise} options={optionsElements}>
        <CheckoutComponent
          // groupedItems={groupedItems}
          paymentMethod={paymentMethod}
          totalPrice={totalPrice}
        />
      </Elements>
    </div>
  );
};
