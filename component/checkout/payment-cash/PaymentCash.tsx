'use client';
import { cancelPaymentIntent } from '@/actions/cancelPaymentIntent';
import { checkQuantity } from '@/actions/checkQuantity';
import { createLabel } from '@/actions/ekont/createLabel';
import { Loader } from '@/component/loader/Loader';
import { AlertBox } from '@/component/modals/AlertBox';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useSenderDetails } from '@/hooks/useSenderDetails';
import { useSenderInfo } from '@/hooks/useSenderInfo';
// import { useSenderInfo } from '@/hooks/useSenderInfo';
import { convertToSubCurrency } from '@/lib/convertAmount';
import { create } from 'domain';
import { redirect, useRouter } from 'next/navigation';

import React, { useState } from 'react';

export const PaymentCash = ({
  isDissabled,
  paymentMethod,
}: {
  isDissabled: boolean;
  paymentMethod: string;
}) => {
  console.log('paymentMethod - CASH', paymentMethod);
  const { senderData } = useSenderInfo();
  const { ekontMethod } = useSenderDetails();
  const {
    totalPrice,
    deliveryCost,
    metadata,
    addressFormData,
    guestFormData,
    items,
    paymentIntentId,
  } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });

  const router = useRouter();

  const orderMethods = {
    deliveryMethod: ekontMethod,
    paymentMethod: paymentMethod,
    deliveryCost: deliveryCost,
  };

  const handleOrderSubmit = async () => {
    setIsLoading(true);

    try {
      if (paymentIntentId) {
        const cancelPaymentInted = await cancelPaymentIntent({
          paymentIntentId,
        });
        console.log(cancelPaymentInted);
      }

      if (!senderData || !addressFormData || !ekontMethod) {
        console.error('Missing required data SENDER, ADDRESS, EKONT METHOD');
        return 0;
      }

      // const validate = await createLabel(
      //   // await createLabel(
      //   senderData,
      //   guestFormData,
      //   addressFormData,
      //   totalPrice,
      //   ekontMethod,
      //   paymentMethod,
      // );

      const res = await fetch('/api/place-order-cash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: items,
          metadata,
          // amount: convertToSubCurrency(totalPrice),
          orderDetails: addressFormData,
          orderMethods,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error('Response is not ok', data?.message);
      }

      if (data.error) {
        throw new Error(data.error.message);
      }

      console.log('Order placed successfully!', data);

      // if (validate?.label.totalPrice) {
      //   setAlertMessage({
      //     title: 'Успешно направена поръчка!',
      //     message: 'Вашата поръчка беше успешно направена!',
      //   });
      //   setShowAlert(true);
      // }
    } catch (error) {
      console.error('Error submiting cash order', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    router.push(`/success?order_number=${metadata.orderNumber}`);
  };

  return (
    <section>
      <Button
        disabled={isDissabled}
        variant={'default'}
        onClick={handleOrderSubmit}
        aria-label="Submit order"
        className={`w-full sm:w-auto min-w-[135px] py-4 mt-4 ${isDissabled && 'cursor-not-allowed opacity-70 '} `}>
        {isLoading ? <Loader /> : isDissabled ? 'Без наличност' : `Поръчай`}
      </Button>
      {showAlert && (
        <AlertBox
          title={alertMessage.title}
          description={alertMessage.message}
          reset={closeAlert}
        />
      )}
    </section>
  );
};
