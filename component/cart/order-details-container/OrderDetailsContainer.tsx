'use client';

import { AddressFormData } from '@/app/store/features/stripe/stripeSlice';
import { CheckoutForm } from '@/component/checkout/checkout-forms/CheckoutForm';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/useCart';
import { useCities } from '@/hooks/useCities';
import { useSpeedyCities } from '@/hooks/useCitiesSpeedy';
import { useSenderDetails } from '@/hooks/useSenderDetails';

import React from 'react';

export const OrderDetailsContainer = () => {
  const { refetchEkont } = useCities(false);
  const { refetchSpeedyCities } = useSpeedyCities(false);

  const { updateAddresData, setDeliveryCost } = useCart();
  const {
    setDeliveryMethod,
    deliveryMethod,
    setSelectedOffice,
    setSearchForCity,
    setSelectedCity,
  } = useSenderDetails();

  const handleSelectDeliveryCompany = (value: string) => {
    const isEkont = value.startsWith('ekont');
    const isSpeedy = value.startsWith('speedy');

    // reset delivery cost
    setDeliveryCost(0);

    // clear city and office data when switch between values
    setSearchForCity('');
    setSelectedCity('');
    setSelectedOffice('');
    updateAddresData({ city: '', officeCode: '' } as AddressFormData);

    // Refetch cities for the selected provider
    if (isEkont) refetchEkont();
    if (isSpeedy) refetchSpeedyCities();

    setDeliveryMethod(value);
  };

  const radioGroupItems = [
    {
      value: 'ekont-office',
      label: 'Доставка до офис на Eконт',
    },
    {
      value: 'ekont-delivery',
      label: 'Доставка с куриер на Eконт',
    },
    {
      value: 'speedy-pickup',
      label: 'Доставка до офис на Спиди',
    },
    {
      value: 'speedy-delivery',
      label: 'Доставка с куриер на Спиди',
    },
  ];

  return (
    <section className="flex-[0.75] bg-secondaryPurple/15 p-5 rounded-lg shadow-md">
      <h3 className="mb-3 border-b-[2px] w-fit pb-2 font-montserrat">
        Изберете метод за доставка
      </h3>
      <RadioGroup
        value={deliveryMethod || ''}
        onValueChange={handleSelectDeliveryCompany}
        className="mt-5 order-2 pb-3">
        <div className="grid md:grid-cols-2 md:grid-rows-2 md:grid-flow-col gap-4">
          {radioGroupItems.map(item => (
            <div key={item.value} className="space-x-2">
              <RadioGroupItem value={item.value} id={item.value} />
              <Label
                htmlFor={item.value}
                className={` space-x-2 cursor-pointer`}>
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
      {deliveryMethod ? <CheckoutForm /> : null}
    </section>
  );
};
