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

import React, { useEffect, useState } from 'react';

export const PaymentCash = ({
  isDissabled,
  paymentMethod,
}: {
  isDissabled: boolean;
  paymentMethod: string;
}) => {
  const { senderData } = useSenderInfo();
  const { deliveryMethod } = useSenderDetails();
  const {
    totalPrice,
    deliveryCost,
    metadata,
    addressFormData,
    guestFormData,
    items,
    paymentIntentId,
    dispatchPaymentIntentId,
  } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [response, setResponse] = useState({
    success: false,
    order_number: '',
  });
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });

  const router = useRouter();

  const orderMethods = {
    deliveryMethod: deliveryMethod,
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

        dispatchPaymentIntentId(null);
        console.log(cancelPaymentInted);
      }

      if (!senderData || !addressFormData || !deliveryMethod) {
        console.error('Missing required data SENDER, ADDRESS, EKONT METHOD');

        setAlertMessage({
          title: 'Възникна грешка',
          message: 'Липсват потребителски данни',
        });
        setShowAlert(true);

        return 0;
      }

      // validate label in Ekont
      const validate = await createLabel(
        senderData,
        guestFormData,
        addressFormData,
        totalPrice,
        deliveryMethod,
        paymentMethod,
      );

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

      if (!data.success) {
        setAlertMessage({
          title: 'Възникна грешка',
          message: data?.error,
        });
        setShowAlert(true);
      }

      if (!res.ok) {
        console.log('Response is not ok', data?.error);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResponse(data);

      if (validate?.label.totalPrice) {
        console.log(`# Send Cart Items successfuly to the backend:`, data);

        setAlertMessage({
          title: 'Успешно направена поръчка!',
          message: 'Вашата поръчка беше успешно направена!',
        });
        setShowAlert(true);
      } else {
        setAlertMessage({
          title: 'Възникна грешка',
          message: 'Вашата поръчка не беше направена.',
        });
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error submiting cash order', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    if (response?.success && !showAlert) {
      router.push(`/success?order_number=${response.order_number}`);
    }
  }, [response, showAlert]);

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
          reset={() => closeAlert()}
        />
      )}
    </section>
  );
};
