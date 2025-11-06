'use client';
import { GuestFormData } from '@/app/store/features/stripe/stripeSlice';
import { CheckoutForm } from '@/component/checkout/checkout-forms/CheckoutForm';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSenderDetails } from '@/hooks/useSenderDetails';

// import { useCities } from '@/hooks/useCities';
import {
  AddressFormDataType,
  fullAddressType,
  GuestFormDataType,
} from '@/lib/form-validation/validations';
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

type OrderDetailsProps = {
  setDeliveryMethodAction: (method: string) => void;
  deliveryMethod: string | null;
  guestForm: UseFormReturn<GuestFormDataType>;
  addressForm: UseFormReturn<fullAddressType>;
  onAddressFormSubmitAction: (data: any) => void;
};

export const OrderDetailsContainer = ({
  setDeliveryMethodAction: setDeliveryMethod,
  deliveryMethod,
  guestForm,
  addressForm,
  onAddressFormSubmitAction: onAddressFormSubmit,
}: OrderDetailsProps) => {
  const { ekontMethod, setEkontMethod } = useSenderDetails();
  // const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null);
  // const { cities, isLoading, isError } = useCities();

  const ekontOffice = () => {
    setDeliveryMethod('ekont-office');
    setEkontMethod('ekont-office');
  };

  const ekontCourier = () => {
    setDeliveryMethod('ekont-courier');
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
    <section className="flex-[0.75] bg-secondaryPurple/15 p-5 rounded-xl shadow-md">
      <h3 className="mb-3 border-b-[2px] w-fit pb-2 font-montserrat">
        Изберете метод за доставка
      </h3>
      <RadioGroup
        value={deliveryMethod || ''}
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
            <RadioGroupItem
              value="ekont-courier"
              id="ekont-courier"

              // className="sr-only"
            />
            <Label
              htmlFor="ekont-courier"
              className={` space-x-2 cursor-pointer`}>
              Доставка до адрес
            </Label>
          </div>
        </div>
      </RadioGroup>
      {deliveryMethod ? (
        <CheckoutForm
          deliveryMethod={deliveryMethod}
          // cities={cities}
          // isLoading={isLoading}
          guestForm={guestForm}
          addressForm={addressForm}
          onAddressFormSubmitAction={onAddressFormSubmit}
        />
      ) : null}
    </section>
  );
};
