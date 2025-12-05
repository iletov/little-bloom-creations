'use client';
import React, { useRef, useState } from 'react';
import { ErrorMessage } from '../checkout-forms/ErrorMessage';
import { Input } from '@/components/ui/input';
import { City } from '../checkout-forms/CheckoutForm';
import { Button } from '@/components/ui/button';
import { Loader } from '@/component/loader/Loader';
import { useCities } from '@/hooks/useCities';
import { useSenderDetails } from '@/hooks/useSenderDetails';
import { useCart } from '@/hooks/useCart';
import { AddressFormData } from '@/app/store/features/stripe/stripeSlice';
import { fullAddress } from '@/lib/form-validation/validations';

export const CityDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [touched, setTouched] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { cities, isLoading } = useCities(false);
  const { searchForCity, setSearchForCity, setSelectedOffice } =
    useSenderDetails();

  const { addressFormData, updateAddresData, setDeliveryCostFlag } = useCart();

  // Filter items based on search term
  const filteredCities =
    !searchForCity || searchForCity.length < 2
      ? cities || []
      : cities?.filter(city => {
          const normalizedSearchTerm = searchForCity.toLowerCase().trim();
          return (
            city?.name?.toLowerCase().includes(normalizedSearchTerm) ||
            city?.nameEn?.toLowerCase().includes(normalizedSearchTerm)
          );
        }) || [];

  const handleSelectCities = async (city: City) => {
    setSearchForCity(city.name);
    updateAddresData({ city: city.name } as AddressFormData);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setSearchForCity('');
    setSelectedOffice('');
    updateAddresData({ city: '' } as AddressFormData);
    setDeliveryCostFlag(false);
    // form.setValue('city', '', { shouldValidate: true });
  };

  const result = fullAddress.safeParse(addressFormData);
  const cityError =
    !result.success && touched
      ? result.error.errors.find(err => err.path[0] === 'city')?.message
      : undefined;

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        // {...form.register('city')}
        name="city"
        placeholder="Населено място"
        className="input_styles"
        value={searchForCity ? searchForCity : addressFormData?.city || ''}
        onChange={e => {
          const value = e.target.value;
          setSearchForCity(value);
          updateAddresData({ city: value } as AddressFormData);
          // form.setValue('city', value, { shouldValidate: true });
          setShowDropdown(true);
        }}
        onBlur={() => setTouched(true)}
        onFocus={() => setShowDropdown(true)}
      />

      {cityError && <ErrorMessage message={cityError} />}
      {searchForCity || addressFormData?.city ? (
        <Button
          onClick={() => handleClear()}
          variant={'link'}
          className="absolute text-[1rem] text-neutral-800  right-4 top-1/2 -translate-y-1/2 w-3.5 p-0 h-3.5 text-center rounded-full overflow-hidden font-montserrat">
          x
        </Button>
      ) : null}

      {showDropdown && filteredCities.length > 0 && (
        <div
          className={` ${isLoading ? 'text-center py-4' : ''} absolute z-10 w-full mt-1 shadow-lg max-h-60 overflow-auto rounded-md font-montserrat`}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {filteredCities.map(city => (
                <div
                  key={city.nameEn + city.id}
                  className="px-4 py-2 text-[1.4rem] bg-white text-neutral-800 hover:bg-green-1 cursor-pointer"
                  onClick={() => handleSelectCities(city)}>
                  {city.name}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
