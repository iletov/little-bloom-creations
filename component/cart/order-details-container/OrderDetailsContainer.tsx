'use client';

import { AddressFormData } from '@/app/store/features/stripe/stripeSlice';
import { CheckoutForm } from '@/component/checkout/checkout-forms/CheckoutForm';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/useCart';
import { useSenderDetails } from '@/hooks/useSenderDetails';

import React from 'react';

export const OrderDetailsContainer = () => {
  const { updateAddresData, setDeliveryCost } = useCart();
  const { setEkontMethod, ekontMethod, setSelectedOffice } = useSenderDetails();

  const ekontOffice = () => {
    setDeliveryCost(0);
    setEkontMethod('ekont-office');
  };

  const ekontCourier = () => {
    setDeliveryCost(0);
    updateAddresData({ officeCode: '' } as AddressFormData);
    setSelectedOffice('');
    setEkontMethod('ekont-courier');
  };

  const handleSelectDeliveryCompany = (value: string) => {
    if (value === 'ekont-office') {
      // handle ekont office delivery
      ekontOffice();
    } else if (value === 'ekont-courier') {
      // handle ekont courier delivery
      ekontCourier();
    }
  };

  return (
    <section className="flex-[0.75] bg-secondaryPurple/15 p-5 rounded-lg shadow-md">
      <h3 className="mb-3 border-b-[2px] w-fit pb-2 font-montserrat">
        Изберете метод за доставка
      </h3>
      <RadioGroup
        value={ekontMethod || ''}
        onValueChange={handleSelectDeliveryCompany}
        className="mt-5 order-2 pb-3">
        <div className="flex flex-col gap-4">
          <div className={`space-x-2`}>
            <RadioGroupItem
              value="ekont-office"
              id="ekont-office"
              // className="sr-only"
            />
            <Label
              htmlFor="ekont-office"
              className={` space-x-2 cursor-pointer`}>
              Доставка до офис на еконт
            </Label>
          </div>
          <div className={`space-x-2`}>
            <RadioGroupItem value="ekont-courier" id="ekont-courier" />
            <Label
              htmlFor="ekont-courier"
              className={` space-x-2 cursor-pointer`}>
              Доставка до адрес
            </Label>
          </div>
        </div>
      </RadioGroup>
      {ekontMethod ? <CheckoutForm /> : null}
    </section>
  );
};
