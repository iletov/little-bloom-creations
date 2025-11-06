import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../checkout-forms/ErrorMessage';
import { Input } from '@/components/ui/input';
import { City } from '../checkout-forms/CheckoutForm';
import { Button } from '@/components/ui/button';
import { Loader } from '@/component/loader/Loader';

interface CityDropdownProps {
  form: any;
  cities: Array<City>;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  onSelect: (item: City) => void;
  // disabled?: boolean;
  isLoading?: boolean;
  // showDropdown: boolean;
  // setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CityDropdown = ({
  form,
  cities,
  searchTerm,
  setSearchTerm,
  onSelect,
  isLoading,
  // disabled,
  // showDropdown,
  // setShowDropdown,
}: CityDropdownProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<Array<City>>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setFilteredCities([]);
      return;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const filtered = cities.filter(
      city =>
        city.name.toLowerCase().includes(normalizedSearchTerm) ||
        city.nameEn.toLowerCase().includes(normalizedSearchTerm),
    );

    setFilteredCities(filtered);
  }, [searchTerm, cities]);

  const handleClear = () => {
    setSearchTerm('');
    form.setValue('city', '', { shouldValidate: true });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        {...form.register('city')}
        placeholder="Населено място"
        className="input_styles"
        value={searchTerm ? searchTerm : form.getValues('city')}
        onChange={e => {
          setSearchTerm(e.target.value);
          form.setValue('city', e.target.value, { shouldValidate: true });
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      />
      {form.formState.errors.country && (
        <ErrorMessage message={form.formState.errors.country.message} />
      )}
      {searchTerm || form.getValues('city') ? (
        <Button
          onClick={() => handleClear()}
          variant={'link'}
          className="absolute text-[1rem] text-neutral-800  right-4 top-1/2 -translate-y-1/2 w-3.5 p-0 h-3.5 text-center rounded-full overflow-hidden font-montserrat">
          x
          {/* <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.5rem]">
            x
          </span> */}
        </Button>
      ) : null}

      {showDropdown && (
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
                  onClick={() => {
                    onSelect(city);
                    setShowDropdown(false);
                  }}>
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
