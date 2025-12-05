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
  const { setDeliveryMethod, deliveryMethod, setSelectedOffice } =
    useSenderDetails();

  console.log('# --OrderDetailsContainer-->', deliveryMethod);

  const ekontOffice = () => {
    setDeliveryCost(0);
    setDeliveryMethod('ekont-office');
  };

  const ekontDelivery = () => {
    setDeliveryCost(0);
    updateAddresData({ officeCode: '' } as AddressFormData);
    setSelectedOffice('');
    setDeliveryMethod('ekont-delivery');
  };

  const speedyPickup = () => {
    setDeliveryCost(0);
    setDeliveryMethod('speedy-pickup');
  };

  const speedyDelivery = () => {
    setDeliveryCost(0);
    updateAddresData({ officeCode: '' } as AddressFormData);
    setSelectedOffice('');
    setDeliveryMethod('speedy-delivery');
  };

  const handleSelectDeliveryCompany = (value: string) => {
    if (value === 'ekont-office' || value === 'ekont-delivery') {
      //refetch ekont cities
      refetchEkont();

      if (value === 'ekont-office') {
        // handle ekont ekont pickup
        ekontOffice();
      } else if (value === 'ekont-delivery') {
        // handle ekont ekont delivery
        ekontDelivery();
      }
    } else if (value === 'speedy-pickup' || value === 'speedy-delivery') {
      refetchSpeedyCities();
      if (value === 'speedy-pickup') {
        // handle speedy pickup
        speedyPickup();
      } else if (value === 'speedy-delivery') {
        // handle speedy delivery
        speedyDelivery();
      }
    }
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
