'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useCart } from '@/hooks/useCart';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from './ErrorMessage';
import { CityDropdown } from '../dropdown-results/CityDropdown';
import {
  AddressFormDataType,
  fullAddress,
  fullAddressType,
  GuestFormDataType,
  guestSchema,
} from '@/lib/form-validation/validations';
import { OfficeDropdown } from '../dropdown-results/OfficeDropdown';
import { useAuth } from '@/hooks/useAuth';
import { useSenderDetails } from '@/hooks/useSenderDetails';
import { zodResolver } from '@hookform/resolvers/zod';
import { OfficeDropdownSpeedy } from '../dropdown-results/OfficeDropdownSpeedy';

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
  // console.log('RENDERED CHECKOUT FORM');
  const { user } = useAuth();
  const {
    saveGuestData,
    guestFormData,
    addressFormData,
    saveAddressData,
    updateAddresData,
    updateGuestData,
  } = useCart();

  const { deliveryMethod, selectedCity, selectedOffice } = useSenderDetails();

  console.log('# --Selected City-->', selectedCity);
  console.log('# --Selected Office-->', selectedOffice);

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
      phoneNumber: addressFormData?.phoneNumber || '',
      postalCode: addressFormData?.postalCode || '',
      street: addressFormData?.street || '',
      officeCode: addressFormData?.officeCode || '',
      streetNumber: addressFormData?.streetNumber || '',
      //only for speedy
      blockNo: addressFormData?.blockNo || '',
      entranceNo: addressFormData?.entranceNo || '',
      floorNo: addressFormData?.floorNo || '',
      apartmentNo: addressFormData?.apartmentNo || '',
      // only for ekont
      other: addressFormData?.other || '',
    },
  });

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
            // onBlur={handleImmediateSave}
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
            // onBlur={handleImmediateSave}
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

          {deliveryMethod.includes('delivery') ? (
            <>
              <Input
                {...addressForm.register('street')}
                placeholder="Улица"
                className="input_styles"
                // onBlur={handleImmediateSave}
                onBlur={e => {
                  handleUpdateOnBlur('street', e.target.value);
                }}
              />
              <Input
                {...addressForm.register('streetNumber')}
                placeholder="Номер на улицата"
                className="input_styles"
                // onBlur={handleImmediateSave}
                onBlur={e => {
                  handleUpdateOnBlur('streetNumber', e.target.value);
                }}
              />

              {deliveryMethod === 'speedy-delivery' ? (
                <>
                  <Input
                    {...addressForm.register('blockNo')}
                    placeholder="Блок"
                    className="input_styles"
                    // onBlur={handleImmediateSave}
                    onBlur={e => {
                      handleUpdateOnBlur('blockNo', e.target.value);
                    }}
                  />
                  <Input
                    {...addressForm.register('entranceNo')}
                    placeholder="Вход"
                    className="input_styles"
                    // onBlur={handleImmediateSave}
                    onBlur={e => {
                      handleUpdateOnBlur('entranceNo', e.target.value);
                    }}
                  />
                  <Input
                    {...addressForm.register('floorNo')}
                    placeholder="Етаж"
                    className="input_styles"
                    // onBlur={handleImmediateSave}
                    onBlur={e => {
                      handleUpdateOnBlur('floorNo', e.target.value);
                    }}
                  />
                  <Input
                    {...addressForm.register('apartmentNo')}
                    placeholder="Апартамент"
                    className="input_styles"
                    // onBlur={handleImmediateSave}
                    onBlur={e => {
                      handleUpdateOnBlur('apartmentNo', e.target.value);
                    }}
                  />
                </>
              ) : (
                <Input
                  {...addressForm.register('other')}
                  placeholder="Друго"
                  className="input_styles"
                  // onBlur={handleImmediateSave}
                  onBlur={e => {
                    handleUpdateOnBlur('other', e.target.value);
                  }}
                />
              )}
            </>
          ) : null}
          {addressForm.formState.errors.street && (
            <ErrorMessage
              message={addressForm.formState.errors.street.message}
            />
          )}
        </form>
      </div>
      {deliveryMethod === 'ekont-office' ? <OfficeDropdown /> : null}

      {deliveryMethod === 'speedy-pickup' ? <OfficeDropdownSpeedy /> : null}

      {/* <Button
        variant="default"
        onClick={labelValidation}
        className={cn(deliveryCostFlag && 'hover:bg-green-1 min-w-[126.7px]')}>
        {deliveryCostFlag ? <Loader /> : 'Validate'}
      </Button> */}
    </div>
  );
};
