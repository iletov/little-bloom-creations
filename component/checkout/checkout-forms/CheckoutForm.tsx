'use client';
import React, { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useCart } from '@/hooks/useCart';

import { Input } from '@/components/ui/input';
import { ErrorMessage } from './ErrorMessage';
import { CityDropdown } from '../dropdown-results/CityDropdown';
import { useCities } from '@/hooks/useCities';
import {
  AddressFormDataType,
  fullAddress,
  fullAddressType,
  GuestFormDataType,
  guestSchema,
} from '@/lib/form-validation/validations';
import { OfficeDropdown } from '../dropdown-results/OfficeDropdown';
import { calculateLabel } from '@/actions/ekont/calculateLabel';
import { useAuth } from '@/hooks/useAuth';
import { useSenderInfo } from '@/hooks/useSenderInfo';
import { useSenderDetails } from '@/hooks/useSenderDetails';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Loader } from '@/component/loader/Loader';
import { cn } from '@/lib/utils';

export interface City {
  id: string;
  name: string;
  nameEn: string;
  countryId: string;
  country: {
    code3: string;
  };
  // Add other properties as needed
}

export const CheckoutForm = () => {
  const { user } = useAuth();
  const {
    saveGuestData,
    guestFormData,
    addressFormData,
    saveAddressData,
    totalPrice,
    setDeliveryCost,
    deliveryCost,
    updateAddresData,
    updateGuestData,
    deliveryCostFlag,
    setDeliveryCostFlag,
  } = useCart();

  const { senderData } = useSenderInfo();
  const { ekontMethod } = useSenderDetails();

  const guestForm = useForm<GuestFormDataType>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      firstName: guestFormData?.firstName || '',
      lastName: guestFormData?.lastName || '',
      email: guestFormData?.email || '',
    },
  });

  const addressForm = useForm<fullAddressType>({
    resolver: zodResolver(fullAddress),

    defaultValues: {
      country: 'България',
      city: addressFormData?.city || '',
      street: addressFormData?.street || '',
      streetNumber: addressFormData?.streetNumber || '',
      other: addressFormData?.other || '',
      postalCode: addressFormData?.postalCode || '',
      phoneNumber: addressFormData?.phoneNumber || '',
      officeCode: addressFormData?.officeCode || '',
    },
  });

  const labelValidation = async () => {
    // setIsLoading(true);
    setDeliveryCostFlag(true);

    try {
      const calculateDeliveryCost = await calculateLabel(
        senderData,
        guestFormData,
        addressFormData,
        totalPrice,
        ekontMethod,
      );
      console.log(
        'calculateDeliveryCost',
        calculateDeliveryCost?.label?.totalPrice,
      );

      setDeliveryCost(calculateDeliveryCost?.label?.totalPrice || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setDeliveryCostFlag(false);
    }
  };

  console.log(
    'GUEST FORM',
    deliveryCostFlag,
    deliveryCost,
    // senderData,
    addressFormData,
  );

  const handleUpdateOnBlur = <K extends keyof AddressFormDataType>(
    key: K,
    value: AddressFormDataType[K],
  ) => {
    updateAddresData({ [key]: value } as AddressFormDataType);
  };

  const handleUpdateGuestOnBlur = () => {
    updateGuestData(guestForm.getValues());
  };

  const onAddressFormSubmit = (data: AddressFormDataType) => {
    saveAddressData(data);
  };

  const onGuestFormSubmit = (data: GuestFormDataType) => {
    saveGuestData(data);
  };

  return (
    <div className="my-5 md:my-10 w-full relative space-y-6">
      <div className="">
        <h4 className="mb-3 border-b-[2px] pb-2 font-montserrat">
          Лични данни
        </h4>
        <form
          className="py-4 font-montserrat"
          onSubmit={e => {
            e.preventDefault();
            guestForm.handleSubmit(onGuestFormSubmit);
          }}>
          <Input
            {...guestForm.register('firstName')}
            placeholder="Име"
            className="input_styles"
            onBlur={handleUpdateGuestOnBlur}
          />
          {guestForm.formState.errors.firstName && (
            <ErrorMessage
              message={guestForm.formState.errors.firstName.message}
            />
          )}
          <Input
            {...guestForm.register('lastName')}
            placeholder="Фамилия"
            className="input_styles"
            onBlur={handleUpdateGuestOnBlur}
          />
          {guestForm.formState.errors.lastName && (
            <ErrorMessage
              message={guestForm.formState.errors.lastName.message}
            />
          )}
          {!user && (
            <Input
              {...guestForm.register('email')}
              placeholder="Имейл"
              className="input_styles"
              onBlur={handleUpdateGuestOnBlur}
            />
          )}

          {!user && guestForm.formState.errors.email && (
            <ErrorMessage message={guestForm.formState.errors.email.message} />
          )}
        </form>
      </div>
      <div className="">
        <h4 className="mb-3 border-b-[2px] w-fit pb-2 font-montserrat">
          Адрес за доставка
        </h4>
        <form
          onSubmit={addressForm.handleSubmit(onAddressFormSubmit)}
          className="py-4">
          <Input
            {...addressForm.register('phoneNumber')}
            placeholder="Телефон"
            className="input_styles"
            onBlur={e => {
              handleUpdateOnBlur('phoneNumber', e.target.value);
            }}
          />
          {addressForm.formState.errors.phoneNumber && (
            <ErrorMessage
              message={addressForm.formState.errors.phoneNumber.message}
            />
          )}

          <Input
            {...addressForm.register('postalCode')}
            placeholder="Пощенски код"
            className="input_styles"
            onBlur={e => {
              handleUpdateOnBlur('postalCode', e.target.value);
            }}
          />
          {addressForm.formState.errors.postalCode && (
            <ErrorMessage
              message={addressForm.formState.errors.postalCode.message}
            />
          )}

          {/* CITY DROPDOWN MENU */}
          <CityDropdown />

          {ekontMethod === 'ekont-courier' ? (
            <>
              <Input
                {...addressForm.register('street')}
                placeholder="Улица"
                className="input_styles"
                onBlur={e => {
                  handleUpdateOnBlur('street', e.target.value);
                }}
              />
              <Input
                {...addressForm.register('streetNumber')}
                placeholder="Номер на улицата"
                className="input_styles"
                onBlur={e => {
                  handleUpdateOnBlur('streetNumber', e.target.value);
                }}
              />
              <Input
                {...addressForm.register('other')}
                placeholder="Друго"
                className="input_styles"
                onBlur={e => {
                  handleUpdateOnBlur('other', e.target.value);
                }}
              />
            </>
          ) : null}
          {addressForm.formState.errors.street && (
            <ErrorMessage
              message={addressForm.formState.errors.street.message}
            />
          )}
        </form>
      </div>
      {ekontMethod === 'ekont-office' ? <OfficeDropdown /> : null}

      <Button
        variant="default"
        onClick={labelValidation}
        className={cn(deliveryCostFlag && 'hover:bg-green-1 min-w-[126.7px]')}>
        {deliveryCostFlag ? <Loader /> : 'Validate'}
      </Button>
    </div>
  );
};
