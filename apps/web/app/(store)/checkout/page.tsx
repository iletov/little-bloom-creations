'use client';
import React, { useState } from 'react';
import { CardPayment } from '@/component/checkout/card-payment/CardPayment';
import { PaymentCash } from '@/component/checkout/payment-cash/PaymentCash';
import { CreditCard, Euro } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import { ItemsList } from '@/component/cart/items-list/ItemsList';
import { convertToSubCurrency } from '@/lib/convertAmount';
import { Separator } from '@/component/separator/Separator';
import { useSenderDetails } from '@/hooks/useSenderDetails';
import { AlertBox } from '@/component/modals/AlertBox';
import { calculateLabel } from '@/actions/ekont/calculateLabel';
import { validateStreetSpeedy } from '@/actions/speedy/validateStreetSpeedy';
import { useSenderInfo } from '@/hooks/useSenderInfo';
import { calculateLabelSpeedy } from '@/actions/speedy/calculateLabelSpeedy';
import { createParcelsFromItems } from '@/lib/utils/createParcelsFromItems';
import { createReceiptFromItems } from '@/lib/utils/createReceiptFromItems';
import { useCalculateShipping } from '@/hooks/api/shipping/shipping-actions.hook';
import { useInitiateStripeOrder } from '@/hooks/api/orders/orders-actions.hook';

import { CartItem } from '@/app/store/features/cart/cartSlice';

import { OrderDetailsContainer } from '@/component/cart/order-details-container/OrderDetailsContainer';
import { OrderSummery } from '@/component/cart/order-summery/OrderSummery';

export default function CheckoutPage() {
  const { deliveryMethod, selectedCity } = useSenderDetails();
  const { senderData, senderDataSpeedy } = useSenderInfo();
  const {
    items,
    totalWeight,
    totalPrice,
    totalItems,
    paymentIntentId,
    addressFormData,
    guestFormData,
    metadata,
    dispatchClientSecret,
    dispatchPaymentIntentId,
    deliveryCost,
    setDeliveryCostFlag,
    setDeliveryCost,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isDissabled, setIsDissabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });

  const { mutateAsync: calculateShipping } = useCalculateShipping();
  const { mutateAsync: initiateStripeOrder, isPending: isStripePending } = useInitiateStripeOrder();

  const handleCardPayment = async () => {
    setPaymentMethod('bank');
    labelValidation('stripe');

    const orderMethods = {
      deliveryMethod: deliveryMethod,
      paymentMethod: 'bank',
      deliveryCost: deliveryCost,
    };

    try {
      const data = await initiateStripeOrder({
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
            officeId: addressFormData?.officeCode ? String(addressFormData.officeCode) : undefined,
          },
          deliveryMethod: deliveryMethod,
          totalAmount: totalPrice + deliveryCost,
          deliveryCost: deliveryCost,
          totalWeight: totalWeight > 0 ? totalWeight : 1,
      });

      if (data?.clientSecret) {
        dispatchClientSecret(data?.clientSecret);
        dispatchPaymentIntentId(data?.paymentIntentId);

        console.log(
          `# Payment Intent created successfuly! Cart Items are send to backend`,
          items,
        );
        console.log('# Response : ', data);
      }
    } catch (error: any) {
      console.error('Error creating checkout session', error);
      setAlertMessage({
        title: 'Възникна грешка',
        message: error?.message || 'Изглежда имаме проблем с плащането, моля изберете друг метод.',
      });
      setShowAlert(true);
    }
  };

  const handleCashPayment = async () => {
    setPaymentMethod('cash');
    labelValidation('cash');
    setIsDissabled(false);
  };

  const labelValidation = async (selectedPaymentMethod: string) => {
    setDeliveryCostFlag(true);

    try {
      const parcels = createParcelsFromItems(items, metadata?.orderNumber);

      const data = await calculateShipping({
          deliveryMethod,
          paymentMethod: selectedPaymentMethod,
          totalWeight: totalWeight > 0 ? totalWeight : 1,
          totalAmount: totalPrice,
          recipientAddress: {
            city: addressFormData?.city,
            postalCode: addressFormData?.postalCode,
            street: addressFormData?.street,
            streetNumber: addressFormData?.streetNumber,
          },
          recipientInfo: {
            firstName: guestFormData?.firstName,
            lastName: guestFormData?.lastName,
            phone: addressFormData?.phoneNumber,
            email: guestFormData?.email,
            officeId: addressFormData?.officeCode ? String(addressFormData.officeCode) : undefined,
          },
          parcels
      });

      setDeliveryCost(data.price || 0);

    } catch (error: any) {
      console.error('Shipping calculation error:', error);
      setAlertMessage({
        title: 'Грешка при изчисляване на доставката',
        message: error?.message || 'Моля, уверете се, че сте попълнили коректно всички данни за доставка.',
      });
      setShowAlert(true);
    } finally {
      setDeliveryCostFlag(false);
    }
  };

  const handlePaymentChange = (value: string) => {
    if (value === 'cash') {
      handleCashPayment();
    } else if (value === 'bank') {
      handleCardPayment();
    }
  };

  const lableStyles = `px-[1rem] cursor-pointer hover:shadow-md py-[1.25rem] border-[1px] text-[1rem] md:text-[1.375rem] font-normal leading-[120%] gap-3 md:gap-1 text-foreground font-montserrat w-full md:w-fit flex md:flex-col justify-start items-center md:items-start transition-all duration-300 ease-in-out bg-secondaryPurple/15 rounded-xl `;

  return (
    <section className="section_wrapper pt-40 xl:px-32 space-y-5 md:flex gap-10 xl:gap-10 mb-[30rem] lg:mb-[24rem]">
      <div className="flex-[1.1] lg:mt-5 px-3">
        <div className="rounded-xl shadow-md border-[1px] my-5 px-3">
          {items?.map(group => (
            <ItemsList
              key={group?.product?.id + crypto.randomUUID().slice(0, 8)}
              group={group}
              checkout={true}
            />
          ))}
        </div>

        <OrderDetailsContainer />

        <div className="mt-10">
          <Label
            htmlFor="ekont-office"
            className={` space-x-2 mt-3 mb-2 text-[2rem] cursor-pointer font-montserrat`}>
            Метод на плащане
          </Label>
          <RadioGroup
            value={paymentMethod || ''}
            onValueChange={handlePaymentChange}
            className="mt-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex w-full md:w-fit ">
                <RadioGroupItem value="cash" id="cash" className="sr-only" />
                <Label
                  htmlFor="cash"
                  className={`${paymentMethod === 'cash' ? 'shadow-md border-green-5 ' : ''} ${lableStyles} ${isStripePending ? 'pointer-events-none opacity-50' : ''}`}>
                  <Euro size={24} />
                  <span>Наложен платеж</span>
                </Label>
              </div>
              <div className="flex">
                <RadioGroupItem value="bank" id="bank" className="sr-only" />
                <Label
                  htmlFor="bank"
                  className={`${paymentMethod === 'bank' ? 'shadow-md border-green-5' : ''}  ${lableStyles}`}>
                  <CreditCard size={24} />
                  <span>С карта - онлайн</span>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-5 mb-16">
          {paymentMethod === 'cash' ? (
            <PaymentCash paymentMethod={paymentMethod} />
          ) : paymentMethod === 'bank' ? (
            <CardPayment paymentMethod={paymentMethod} />
          ) : null}
        </div>
      </div>

      <div className="flex-[0.75]">
        <OrderSummery />
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
}
