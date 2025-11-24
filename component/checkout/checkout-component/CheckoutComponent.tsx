'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GroupedCartItem, Metadata } from '@/app/api/payment-intent/route';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import { Loader } from '../../loader/Loader';
import { useCart } from '@/hooks/useCart';
import { CancelPayment } from '../../buttons/CancelPayment';
import { Button } from '@/components/ui/button';
import { checkQuantity } from '@/actions/checkQuantity';
// import { useSenderInfo } from '@/hooks/useSenderInfo';
import { useSenderDetails } from '@/hooks/useSenderDetails';
import { AlertBox } from '@/component/modals/AlertBox';
import { useSenderInfo } from '@/hooks/useSenderInfo';
import { createLabel } from '@/actions/ekont/createLabel';

interface Props {
  // groupedItems: GroupedCartItem[];
  // metadata: Metadata;
  totalPrice: number;
  paymentMethod: string;
}

export const CheckoutComponent = ({ totalPrice, paymentMethod }: Props) => {
  const stripe = useStripe();

  const { senderData } = useSenderInfo();
  const { ekontMethod } = useSenderDetails();
  const elements = useElements();
  const {
    errorState,
    clientSecret,
    metadata,
    paymentIntentId,
    groupedItems,
    guestFormData,
    dispatchPaymentIntentId,
    addressFormData,
  } = useCart();

  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });

  const pathToRedirect = '/cart';
  const disabledBtn =
    // !stripe ||
    // !elements ||
    // loading ||
    !clientSecret || !paymentIntentId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      console.log('Stripe.js has not loaded yet.');
      return;
    }

    // clear the payment intent id
    dispatchPaymentIntentId(null);

    if (!senderData || !addressFormData || !ekontMethod) {
      return 0;
    }
    const validate = await createLabel(
      senderData,
      guestFormData,
      addressFormData,
      totalPrice,
      ekontMethod,
      paymentMethod,
    );

    if (validate?.label.totalPrice) {
      setAlertMessage({
        title: 'Успешно направена поръчка!',
        message: 'Вашата поръчка беше успешно направена!',
      });
      setShowAlert(true);
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: clientSecret ?? '',
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?payment_intent=${clientSecret}&order_number=${metadata.orderNumber}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return <Loader />;
  }

  return (
    <section>
      <form onSubmit={handleSubmit}>
        {clientSecret && (
          <>
            <PaymentElement
              options={{
                layout: 'tabs',
              }}
            />
          </>
        )}
      </form>
      <div className="flex gap-3 mt-3">
        <Button
          variant={'default'}
          onClick={handleSubmit}
          className={`py-4 px-4 min-w-[135px]
            ${disabledBtn ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={disabledBtn}>
          {loading ? <Loader /> : <span>Pay</span>}
        </Button>

        <CancelPayment
          // paymentIntentId={paymentIntentId as string}
          path={pathToRedirect}
        />
        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
        {errorState && <div className="text-purple-500 mt-2">{errorState}</div>}
      </div>
      {showAlert && (
        <AlertBox
          title={alertMessage.title}
          description={alertMessage.message}
          reset={() => setShowAlert(false)}
        />
      )}
    </section>
  );
};
