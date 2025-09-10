'use client';
import { cancelPaymentIntent } from '@/actions/cancelPaymentIntent';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react';
import { Loader } from '../loader/Loader';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

type CancelPaymentIntentProps = {
  // paymentIntentId: string;
  path?: string;
};

export const CancelPayment = ({
  // paymentIntentId,
  path,
}: CancelPaymentIntentProps) => {
  const router = useRouter();
  const { paymentIntentId, dispatchPaymentIntentId } = useCart();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleCancelPayment = async () => {
    try {
      setLoading(true);
      if (paymentIntentId) {
        const cancelPaymentInted = await cancelPaymentIntent({
          paymentIntentId,
        });
        console.log(cancelPaymentInted);
        dispatchPaymentIntentId(null);
      } else {
        console.error('No payment intent id');
      }

      if (path?.includes('/cart')) {
        router.push(path ?? '');
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error canceling payment intent through button', error);
      setErr('This payment has allready been canceled' as string | null);
      // throw error;
    }
    // setLoading(false);
  };

  return (
    <div>
      <Button variant={'destructive'} onClick={handleCancelPayment}>
        {loading && !err ? <Loader /> : <span>Cancel Payment</span>}
      </Button>
      {err && <p className="text-red-500">{err}</p>}
    </div>
  );
};
