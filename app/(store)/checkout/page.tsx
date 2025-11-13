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
import { checkQuantity } from '@/actions/checkQuantity';
import { Offices } from '@/component/ekont/Offices';
import { useSenderDetails } from '@/hooks/useSenderDetails';
import { AlertBox } from '@/component/modals/AlertBox';
import { notFound, redirect } from 'next/navigation';

// redirect(notFound());

export default function CheckoutPage() {
  // const { user } = useUser();
  const {
    groupedItems,
    totalPrice,
    paymentIntentId,
    guestFormData,
    addressFormData,
    metadata,
    dispatchClientSecret,
    dispatchPaymentIntentId,
    deliveryCost,
  } = useCart();
  const { ekontMethod } = useSenderDetails();
  const totalItemsCount = groupedItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // console.log('CHECKOUT', guestFormData, addressFormData);

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isDissabled, setIsDissabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });

  const handleCardPayment = async () => {
    setPaymentMethod('card');

    const orderMethods = {
      deliveryMethod: ekontMethod,
      paymentMethod: 'card',
    };

    try {
      setIsLoading(true);

      const response = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: groupedItems,
          metadata,
          existingPaymentIntentId: paymentIntentId ?? null,
          amount: convertToSubCurrency(totalPrice),
          orderDetails: addressFormData,
          orderMethods,
        }),
      });
      const data = await response.json();
      // console.log('Payment Intent Data:', data);

      if (!response.ok) {
        setAlertMessage({
          title: 'Възникна грешка',
          message:
            'Изглежда имаме проблем с плащането, моля изберете друг метод за плащане.',
        });
        setShowAlert(true);
      }

      if (data?.clientSecret) {
        dispatchClientSecret(data?.clientSecret);
        dispatchPaymentIntentId(data?.paymentIntentId);
      }
    } catch (error: any) {
      console.error('Error creating checkout session', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashPayment = async () => {
    setPaymentMethod('cash');
    setIsDissabled(false);
    // check the quantity
    const stockErrors = await checkQuantity({ cartItems: groupedItems });

    if (stockErrors) {
      setIsDissabled(true);
      console.log('stockErrors', stockErrors);

      const errorMessage = stockErrors
        .map(error => `${error.name} временно няма в наличност: ${error.stock}`)
        .join(', ');

      setAlertMessage({ title: 'Error', message: errorMessage });
      setShowAlert(true);
      setIsLoading(false);
      return;
    }
    // console.log('Payment method changed to cash');
  };

  const handlePaymentChange = (value: string) => {
    if (value === 'cash') {
      handleCashPayment();
    } else if (value === 'card') {
      handleCardPayment();
    }
  };

  const lableStyles = `px-[1rem] cursor-pointer hover:shadow-md py-[1.25rem] border-[1px] text-[1rem] md:text-[1.375rem] font-normal leading-[120%] gap-3 md:gap-1 text-foreground font-montserrat w-full md:w-fit flex md:flex-col justify-start items-center md:items-start transition-all duration-300 ease-in-out bg-secondaryPurple/15 rounded-xl `;

  return (
    <section className="section_wrapper pt-40 xl:px-32 space-y-5 gap-10 xl:gap-10 mb-[30rem] lg:mb-[24rem] grid ">
      <div className="rounded-xl shadow-md border-[1px] my-5 px-3">
        {groupedItems?.map(group => (
          <ItemsList key={group.product._id} group={group} checkout={true} />
        ))}
        <Separator className="border-[0.5px] border-green-1" />
        <div className="w-full md:w-fit grid ml-auto space-y-1 px-2 pb-4">
          <p className="flex gap-4 items-center justify-between">
            Продукти: <span>{totalItemsCount}</span>
          </p>
          <p className="flex gap-4 items-center justify-between">
            Доставка: <span>{deliveryCost} лв</span>
          </p>
          <Separator className=" bg-green-5" />
          <p className="text-[1.8rem] font-semibold flex gap-4 items-center justify-between">
            Общо: <span>{(totalPrice + deliveryCost).toFixed(2)} лв.</span>
          </p>
        </div>
      </div>
      <>
        <Label
          htmlFor="ekont-office"
          className={` space-x-2 mt-3 mb-2 text-[2rem] cursor-pointer font-montserrat`}>
          Изберете начин на плащане
        </Label>
        <RadioGroup
          value={paymentMethod || ''}
          onValueChange={handlePaymentChange}
          className="mt-5 order-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex w-full md:w-fit ">
              <RadioGroupItem value="cash" id="cash" className="sr-only" />
              <Label
                htmlFor="cash"
                className={`${paymentMethod === 'cash' ? 'shadow-md border-green-5 ' : ''} ${lableStyles} ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                <Euro size={24} />
                <span>Наложен платеж</span>
              </Label>
            </div>
            <div className="flex">
              <RadioGroupItem value="card" id="card" className="sr-only" />
              <Label
                htmlFor="card"
                className={`${paymentMethod === 'card' ? 'shadow-md border-green-5' : ''}  ${lableStyles}`}>
                <CreditCard size={24} />
                <span>С карта - онлайн</span>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </>

      {/* <Offices /> */}

      <div className="mt-5 mb-16 order-3">
        {paymentMethod === 'cash' ? (
          <PaymentCash
            isDissabled={isDissabled}
            paymentMethod={paymentMethod}
          />
        ) : paymentMethod === 'card' ? (
          <CardPayment paymentMethod={paymentMethod} />
        ) : null}
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
