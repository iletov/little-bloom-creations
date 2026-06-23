'use client';
import { cancelPaymentIntent } from '@/actions/cancelPaymentIntent';
import { Loader } from '@/component/loader/Loader';
import { toast } from 'sonner';
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

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

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

  const [response, setResponse] = useState({
    success: false,
    order_number: '',
  });

  const { mutateAsync: placeCashOrder, isPending: isCashPending } = usePlaceCashOrder();

  const router = useRouter();

  const orderMethods = {
    deliveryMethod: deliveryMethod,
    paymentMethod: paymentMethod,
    deliveryCost: deliveryCost,
  };

  const isEkont = deliveryMethod.startsWith('ekont');
  const isSpeedy = deliveryMethod.startsWith('speedy');

  const handleOrderSubmit = async (): Promise<void | 0> => {
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

        toast.error('Възникна грешка', {
          description: 'Липсват потребителски данни',
        });

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
            quantity: Number(item.quantity || 1),
            unitPrice: Number(item.product.variant_price || item.product.price || 0),
            weight: Number(item.product.weight || 0),
            personalization: item.personalisation || undefined,
          })),
          recipientAddress: {
            city: addressFormData?.city,
            postalCode: addressFormData?.postalCode,
            street: addressFormData?.street,
            streetNumber: addressFormData?.streetNumber,
            country: addressFormData?.country || 'BG',
            siteId: selectedCity?.id,
            streetId: validationStreet?.id,
          },
          recipientInfo: {
            firstName: guestFormData?.firstName,
            lastName: guestFormData?.lastName,
            phone: addressFormData?.phoneNumber,
            email: user?.email ?? guestFormData?.email,
            officeId: addressFormData?.officeCode ? String(addressFormData.officeCode) : undefined,
          },
          deliveryMethod: deliveryMethod,
          totalAmount: Number((totalPrice || 0) + (deliveryCost || 0)),
          deliveryCost: Number(deliveryCost || 0),
          totalWeight: Number(totalWeight) > 0 ? Number(totalWeight) : 1,
      });

      setResponse({ success: true, order_number: data.orderNumber });

      toast.success('Успешно направена поръчка!', {
        description: 'Вашата поръчка беше успешно направена!',
      });
    } catch (error: unknown) {
      console.error('Error submiting cash order', error);
      toast.error('Възникна грешка', {
        description: getErrorMessage(
          error,
          'Възникна неочаквана грешка при запазване на поръчката.',
        ),
      });
    }
  };

  useEffect(() => {
    if (response?.success) {
      router.push(`/success?order_number=${response.order_number}`);
    }
  }, [response, router]);

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
    </section>
  );
};
