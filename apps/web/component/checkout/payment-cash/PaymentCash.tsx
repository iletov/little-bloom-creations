'use client';
import { cancelPaymentIntent } from '@/actions/cancelPaymentIntent';
import { createLabel } from '@/actions/ekont/createLabel';
import { createShipmentSpeedy } from '@/actions/speedy/createShipmentSpeedy';
import { Loader } from '@/component/loader/Loader';
import { AlertBox } from '@/component/modals/AlertBox';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useSenderDetails } from '@/hooks/useSenderDetails';
import { useSenderInfo } from '@/hooks/useSenderInfo';
import { useRouter } from 'next/navigation';
import { createParcelsFromItems } from '@/lib/utils/createParcelsFromItems';
import { CartItem } from '@/app/store/features/cart/cartSlice';

import React, { useEffect, useState } from 'react';
import { createReceiptFromItems } from '@/lib/utils/createReceiptFromItems';
import { createPackingListFromItems } from '@/lib/utils/createPackingListFromItems';
import { usePlaceCashOrder } from '@/hooks/api/orders/orders-actions.hook';

export const PaymentCash = ({
  isDissabled,
  paymentMethod,
}: {
  isDissabled?: boolean;
  paymentMethod: string;
}) => {
  const { senderData, senderDataSpeedy } = useSenderInfo(false);
  const { user } = useAuth();
  const {
    deliveryMethod,
    selectedOffice,
    selectedCity,
    validationStreet,
    setSenderDetails,
  } = useSenderDetails();
  const {
    totalPrice,
    deliveryCost,
    metadata,
    addressFormData,
    guestFormData,
    items,
    paymentIntentId,
    dispatchPaymentIntentId,
    setMetadata,
    deliveryCostFlag,
    totalWeight,
  } = useCart();

  const [showAlert, setShowAlert] = useState(false);
  const [response, setResponse] = useState({
    success: false,
    order_number: '',
  });
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });

  const { mutateAsync: placeCashOrder, isPending: isCashPending } = usePlaceCashOrder();

  const router = useRouter();

  const orderMethods = {
    deliveryMethod: deliveryMethod,
    paymentMethod: paymentMethod,
    deliveryCost: deliveryCost,
  };

  const isEkont = deliveryMethod.startsWith('ekont');
  const isSpeedy = deliveryMethod.startsWith('speedy');

  const handleOrderSubmit = async () => {
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

      const data = await placeCashOrder({
          items: items.map((item: CartItem) => ({
            productId: item.product.id || item.product._id,
            variantId: item.product.variant_id || undefined,
            sku: item.product.sku || 'N/A',
            variantSku: item.product.variant_sku || undefined,
            name: item.product.name || item.product.title,
            variantName: item.product.variant_name || undefined,
            quantity: item.quantity,
            unitPrice: item.product.variant_price || item.product.price,
            weight: item.product.weight || 0,
            personalization: item.personalisation || undefined,
          })),
          recipientAddress: {
            city: addressFormData?.city,
            postalCode: addressFormData?.postalCode,
            street: addressFormData?.street,
            streetNumber: addressFormData?.streetNumber,
            country: addressFormData?.country || 'BG',
          },
          recipientInfo: {
            firstName: guestFormData?.firstName,
            lastName: guestFormData?.lastName,
            phone: addressFormData?.phoneNumber,
            email: guestFormData?.email,
            officeId: addressFormData?.officeCode,
          },
          deliveryMethod: deliveryMethod,
          totalAmount: totalPrice + deliveryCost,
          deliveryCost: deliveryCost,
          totalWeight: totalWeight,
      });

      setResponse({ success: true, order_number: data.orderNumber });

      setAlertMessage({
        title: 'Успешно направена поръчка!',
        message: 'Вашата поръчка беше успешно направена!',
      });
      setShowAlert(true);
    } catch (error: any) {
      console.error('Error submiting cash order', error);
      setAlertMessage({
        title: 'Възникна грешка',
        message: error?.message || 'Възникна неочаквана грешка при запазване на поръчката.',
      });
      setShowAlert(true);
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
        disabled={isDissabled || deliveryCost === 0}
        variant={'default'}
        onClick={handleOrderSubmit}
        aria-label="Submit order"
        className={`w-full sm:w-auto min-w-[135px] py-4 mt-4 ${isDissabled && 'cursor-not-allowed opacity-70 '} `}>
        {isCashPending || deliveryCostFlag ? (
          <Loader />
        ) : isDissabled ? (
          'Без наличност'
        ) : (
          `Поръчай`
        )}
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
