'use client';
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from './ErrorMessage';
import { CityDropdown } from '../dropdown-results/CityDropdown';
import { useCities } from '@/hooks/useCities';
import {
  AddressFormDataType,
  fullAddressType,
  GuestFormDataType,
} from '@/lib/form-validation/validations';
import { OfficeDropdown } from '../dropdown-results/OfficeDropdown';
import { calculateLabel } from '@/actions/ekont/calculateLabel';
import { senderInfo } from '@/actions/ekont/senderDetails';
import useSWR from 'swr';
import { useSenderInfo } from '@/hooks/useSenderInfo';

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

type FormDataType = {
  deliveryMethod: string | null;
  guestForm: UseFormReturn<GuestFormDataType>;
  addressForm: UseFormReturn<fullAddressType>;
  onAddressFormSubmitAction: (data: AddressFormDataType) => void;
};

export const CheckoutForm = ({
  deliveryMethod,
  guestForm,
  addressForm,
  onAddressFormSubmitAction: onAddressFormSubmit,
}: FormDataType) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [officeCode, setOfficeCode] = useState('');
  const { user } = useUser();
  const [isDeliveryCost, setIsDeliveryCost] = useState(false);
  const {
    saveGuestData,
    guestFormData,
    addressFormData,
    saveAddressData,
    totalPrice,
    setDeliveryCost,
    deliveryCost,
  } = useCart();
  const { cities, isLoading, isError } = useCities();
  const { senderData } = useSenderInfo();
  // console.log('USER CART--->', guestFormData, addressFormData);

  useEffect(() => {
    if (isDeliveryCost) {
      calculateAndSetDeliveryCost().then(res => {
        setDeliveryCost(res);
        setIsDeliveryCost(false); // Reset the flag after calculation
      });
    }
  }, [isDeliveryCost]);

  const calculateAndSetDeliveryCost = async () => {
    if (!senderData || !addressFormData || !deliveryMethod) {
      return 0;
    }

    const calculateDeliveryCost = await calculateLabel(
      senderData,
      guestFormData,
      addressFormData,
      totalPrice,
      deliveryMethod,
    );

    return calculateDeliveryCost?.label?.totalPrice || 0;
  };

  const handleSelectCities = async (city: City) => {
    addressForm.setValue('city', city.name, { shouldValidate: true });
    setCitySearchTerm(city.name);
    const deliveryFormValid = await addressForm.trigger();
    if (deliveryFormValid) {
      saveAddressData(addressForm.getValues());
    }
    if (deliveryMethod === 'ekont-courier') {
      setIsDeliveryCost(true);
    }
    setShowDropdown(false);
  };

  const selectedCityData = cities?.find(
    city => citySearchTerm.toLowerCase() === city.name.toLowerCase(),
  );

  const onGuestFormSubmit = (data: GuestFormDataType) => {
    saveGuestData(data);
  };

  const handleSelectOffice = async (office: any) => {
    setOfficeCode(office.code);
    addressForm.setValue('officeCode', office.code, { shouldValidate: true });
    const deliveryFormValid = await addressForm.trigger();
    const guestformValid = await guestForm.trigger();
    if (deliveryFormValid) {
      saveAddressData(addressForm.getValues());
      // saveGuestData(guestForm.getValues());
    }

    setIsDeliveryCost(true);
  };

  return (
    <div className="my-5 md:my-10 w-full relative space-y-6">
      <div className="">
        <h4 className="text-lg mb-3 border-b-[2px] pb-2 font-montserrat">
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
            />
          )}

          {!user && guestForm.formState.errors.email && (
            <ErrorMessage message={guestForm.formState.errors.email.message} />
          )}
        </form>
      </div>
      <div className="">
        <h4 className="text-lg mb-3 border-b-[2px] w-fit pb-2 font-montserrat">
          Адрес за доставка
        </h4>
        <form
          onSubmit={addressForm.handleSubmit(onAddressFormSubmit)}
          className="py-4">
          <Input
            {...addressForm.register('phoneNumber')}
            placeholder="Телефон"
            className="input_styles"
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
          />
          {addressForm.formState.errors.postalCode && (
            <ErrorMessage
              message={addressForm.formState.errors.postalCode.message}
            />
          )}

          <CityDropdown
            form={addressForm}
            cities={cities || []}
            searchTerm={citySearchTerm}
            setSearchTerm={setCitySearchTerm}
            onSelect={handleSelectCities}
            isLoading={isLoading}
          />

          {deliveryMethod === 'ekont-courier' ? (
            <>
              <Input
                {...addressForm.register('street')}
                placeholder="Улица"
                className="input_styles"
                // onFocus={handleStreetFocus}
              />
              <Input
                {...addressForm.register('streetNumber')}
                placeholder="Номер на улицата"
                className="input_styles"
              />
              <Input
                {...addressForm.register('other')}
                placeholder="Друго"
                className="input_styles"
                // onBlur={handleStreetFocus}
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
      {deliveryMethod === 'ekont-office' ? (
        <OfficeDropdown
          {...addressForm.register('officeCode')}
          selectedCityData={selectedCityData}
          onOfficeSelect={handleSelectOffice}
        />
      ) : null}
    </div>
  );
};
