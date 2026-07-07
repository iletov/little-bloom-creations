'use client';
import { cn } from '@/lib/utils';
import React, { useRef, useState } from 'react';
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
import { toast } from 'sonner';
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
import { useAuth } from '@/hooks/useAuth';
import { ProviderErrorModal } from '@/component/modals/ProviderErrorModal';

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export default function CheckoutPage() {
  const { user, loading: isAuthLoading } = useAuth();
  const { deliveryMethod, selectedCity, validationStreet } = useSenderDetails();
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
    setMetadata,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isDissabled, setIsDissabled] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const isStripeInitiationLocked = useRef(false);
  const { mutateAsync: calculateShipping } = useCalculateShipping();
  const { mutateAsync: initiateStripeOrder, isPending: isStripePending } = useInitiateStripeOrder();
  const checkoutEmail = user?.email ?? guestFormData?.email;
  const firstName = guestFormData?.firstName || user?.user_metadata?.firstName || user?.user_metadata?.first_name;
  const lastName = guestFormData?.lastName || user?.user_metadata?.lastName || user?.user_metadata?.last_name;

  const handleCardPayment = async (): Promise<void> => {
    if (isStripeInitiationLocked.current || isStripePending) {
      return;
    }

    isStripeInitiationLocked.current = true;
    setPaymentMethod('bank');

    try {
      const currentDeliveryCost = await labelValidation('stripe');
      const data = await initiateStripeOrder({
          existingOrderNumber: metadata?.orderNumber || undefined,
          existingPaymentIntentId: paymentIntentId || undefined,
          items: items.map((item: CartItem) => ({
            productId: item.product.id || item.product._id,
            variantId: item.product.variant_id || undefined,
            sku: item.product.sku || 'N/A',
            variantSku: item.product.variant_sku || undefined,
            name: item.product.name || item.product.title,
            variantName: item.product.variant_name || undefined,
            quantity: Number(item.quantity || 1),
            unitPrice: Number(item.product.variant_price || item.product.price || 0) + Number(item.personalisation?.addonPrice || 0),
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
            email: checkoutEmail,
            officeId: addressFormData?.officeCode ? String(addressFormData.officeCode) : undefined,
            officeName: addressFormData?.officeName,
          },
          deliveryMethod: deliveryMethod,
          totalAmount: Number((totalPrice || 0) + (currentDeliveryCost || 0)),
          deliveryCost: Number(currentDeliveryCost || 0),
          totalWeight: Number(totalWeight > 0 ? totalWeight : 1),
      });

      if (data?.clientSecret) {
        dispatchClientSecret(data?.clientSecret);
        dispatchPaymentIntentId(data?.paymentIntentId);
        
        if (data?.orderNumber) {
           setMetadata({ ...metadata, orderNumber: data.orderNumber });
        }

        console.log(
          `# Payment Intent created successfuly! Cart Items are send to backend`,
          items,
        );
        // console.log('# Response : ', data);
      }
    } catch (error: unknown) {
      console.error('Error creating checkout session', error);
      setCalculationError(getErrorMessage(error, 'Изглежда имаме проблем с плащането, моля изберете друг метод.'));
    } finally {
      isStripeInitiationLocked.current = false;
    }
  };

  const handleCashPayment = async (): Promise<void> => {
    setPaymentMethod('cash');
    try {
      await labelValidation('cash');
      setIsDissabled(false);
    } catch (error) {
      // Alert is shown inside labelValidation
    }
  };

  const labelValidation = async (
    selectedPaymentMethod: string,
  ): Promise<number> => {
    setDeliveryCostFlag(true);

    try {
      const parcels = createParcelsFromItems(items, metadata?.orderNumber);

      const data = await calculateShipping({
          deliveryMethod,
          paymentMethod: selectedPaymentMethod,
          totalWeight: Number(totalWeight) > 0 ? Number(totalWeight) : 1,
          totalAmount: Number(totalPrice),
          recipientAddress: {
            city: addressFormData?.city,
            postalCode: addressFormData?.postalCode,
            street: addressFormData?.street,
            streetNumber: addressFormData?.streetNumber,
            siteId: selectedCity?.id,
            streetId: validationStreet?.id,
          },
          recipientInfo: {
            firstName: guestFormData?.firstName,
            lastName: guestFormData?.lastName,
            phone: addressFormData?.phoneNumber,
            email: checkoutEmail,
            officeId: addressFormData?.officeCode ? String(addressFormData.officeCode) : undefined,
          },
          parcels
      });

      setDeliveryCost(data.price || 0);
      return data.price || 0;

    } catch (error: unknown) {
      console.error('Shipping calculation error:', error);
      setCalculationError(getErrorMessage(error, 'Моля, уверете се, че сте попълнили коректно всички данни за доставка.'));
      throw error;
    } finally {
      setDeliveryCostFlag(false);
    }
  };

  const handlePaymentChange = (value: string): void => {
    if (value === 'cash') {
      handleCashPayment();
    } else if (value === 'bank') {
      handleCardPayment();
    }
  };

  const isOfficeDelivery = deliveryMethod?.includes('office') || deliveryMethod === 'speedy-office';
  const isAddressDelivery = deliveryMethod?.includes('delivery');

  const isFormValid = Boolean(
    !isAuthLoading &&
    firstName &&
    lastName &&
    checkoutEmail &&
    addressFormData?.phoneNumber &&
    addressFormData?.city &&
    deliveryMethod &&
    (
      (isOfficeDelivery && addressFormData?.officeCode) ||
      (isAddressDelivery && addressFormData?.street && addressFormData?.streetNumber)
    )
  );

  const lableStyles = `px-[1rem] cursor-pointer hover:shadow-md py-[1.25rem] border-[1px] text-[1.2rem] md:text-[1.375rem] font-medium leading-[120%] gap-3 md:gap-1 text-foreground font-montserrat w-full flex flex-row md:flex-col justify-start md:justify-center items-center transition-all duration-300 ease-in-out bg-secondaryPurple/15 rounded-xl `;

  return (
    <section className="section_wrapper pt-10 xl:px-32 space-y-5 md:flex gap-10 xl:gap-10 pb-[10rem] lg:mb-[24rem]">
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

        <div className={cn("transition-opacity duration-300", !isFormValid ? "opacity-50 pointer-events-none" : "opacity-100")}>
          <div className="mt-10">
            <Label
              htmlFor="ekont-office"
              className="space-x-2 mt-3 mb-2 text-[2rem] cursor-pointer font-montserrat">
              Метод на плащане
            </Label>
            <RadioGroup
              value={paymentMethod || ''}
              onValueChange={handlePaymentChange}
              className="mt-5">
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="flex w-full md:flex-1">
                  <RadioGroupItem value="cash" id="cash" className="sr-only" />
                  <Label
                    htmlFor="cash"
                    className={cn(lableStyles, paymentMethod === 'cash' && "shadow-md border-green-5", isStripePending && "pointer-events-none opacity-50")}>
                    <Euro size={24} />
                    <span>Наложен платеж</span>
                  </Label>
                </div>
                <div className="flex w-full md:flex-1">
                  <RadioGroupItem value="bank" id="bank" className="sr-only" />
                  <Label
                    htmlFor="bank"
                    className={cn(
                      lableStyles,
                      paymentMethod === 'bank' && "shadow-md border-green-5",
                      isStripePending && "pointer-events-none opacity-50",
                    )}>
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
      </div>

      <div className="flex-[0.75]">
        <OrderSummery />
      </div>
      <ProviderErrorModal 
        error={calculationError}
        onClose={() => setCalculationError(null)}
        title="Възникна проблем"
      />
    </section>
  );
}
