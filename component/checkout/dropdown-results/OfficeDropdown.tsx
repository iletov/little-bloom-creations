'use client';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Check, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { Loader } from '@/component/loader/Loader';
import { useOffices } from '@/hooks/useOffices';
import { useCities } from '@/hooks/useCities';
import { useSenderDetails } from '@/hooks/useSenderDetails';
import { useCart } from '@/hooks/useCart';
import { AddressFormData } from '@/app/store/features/stripe/stripeSlice';
import { useSenderInfo } from '@/hooks/useSenderInfo';
import { useSpeedyCities } from '@/hooks/useCitiesSpeedy';
import { formatTime } from '@/lib/ekont/formatTime';

export interface Office {
  id: string;
  name: string;
  code: string;
  hubCode: string;
  address: {
    fullAddress: string;
    city: {
      postCode: string;
    };
  };
  normalBusinessHoursFrom: number;
  normalBusinessHoursTo: number;
  halfDayBusinessHoursFrom: number;
  halfDayBusinessHoursTo: number;
}

interface CustomDropdownProps {
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  // selectedCityData: City | undefined;
  // onOfficeSelect?: (office: Office) => void;
}
export const OfficeDropdown = ({
  // options,
  placeholder = 'Select option',
  className,
  disabled = false,
  // selectedCityData,
  // onOfficeSelect,
}: CustomDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // const { senderData } = useSenderInfo();
  const { selectedOffice, setSelectedOffice, deliveryMethod, selectedCity } =
    useSenderDetails();
  const { updateAddresData, setDeliveryCost } = useCart();

  // console.log('# --selectedCity EKONT-->', selectedCity);

  const { offices, isLoading, error } = useOffices(
    selectedCity?.country?.code3,
    selectedCity?.id,
    deliveryMethod === 'ekont-office',
  );

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    );

  if (error) return <p>faild to load offices</p>;

  const handleSelectOffice = async (currentOffice: Office) => {
    setSelectedOffice(currentOffice);
    updateAddresData({ officeCode: currentOffice?.code } as AddressFormData);
    // setDeliveryCostFlag(true);
    setDeliveryCost(0);
    setOpen(false);
  };

  const filteredOffices = searchQuery
    ? offices?.filter(office =>
        office.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : offices;

  return (
    <section className=" w-full relative space-y-2">
      <h4 className=" mb-3 border-b-[2px] w-fit pb-2 font-montserrat bg">
        Изберете офис
      </h4>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between min-h-[2.85rem] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring font-montserrat bg-green-5 text-white px-[8px] [&_svg]:size-[unset]',
              className,
            )}
            disabled={disabled || !selectedCity}>
            {selectedOffice ? (
              <p className="flex gap-2 ">
                <span>{selectedOffice.name}</span>
                <span>({selectedOffice.code})</span>
              </p>
            ) : (
              <p className="text-white">{placeholder}</p>
            )}
            <ChevronDown size={20} className="shrink-0 " />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={10}
          className=" md:w-[calc(100%-1.26rem)] p-0 border-[1px] shadow-lg rounded-xl font-montserrat">
          <Command>
            <CommandInput
              placeholder="Search offices..."
              className="min-h-16 py-1 text-[1.4rem] bg-white"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />

            <CommandList>
              {isLoading ? (
                <div className="w-full py-6 text-center text-[1.4rem] text-gray-500">
                  <Loader />
                </div>
              ) : (
                <>
                  <CommandEmpty>No offices found.</CommandEmpty>
                  <CommandGroup className="max-h-72 overflow-auto ">
                    {filteredOffices?.map(office => (
                      <CommandItem
                        key={office.id}
                        className="cursor-pointer border-b-[1px] py-1.5 data-[selected=true]:bg-green-1/30"
                        value={office.name}
                        onSelect={() => handleSelectOffice(office)}>
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedOffice?.id === office.id
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        <div className="flex flex-col items-start justify-center ">
                          <div className="flex gap-2 font-bold [&>p]:text-[1.4rem]">
                            <p>{office.name}</p>
                            <p>({office.code})</p>
                          </div>
                          <div className="flex gap-1 [&>p]:text-[1.2rem]">
                            <p>{office.address.city.postCode},</p>
                            <p>{office.address.fullAddress}</p>
                          </div>
                          <div className="flex gap-1 [&>p]:text-[1.2rem]">
                            <p>Понеделник - Петък:</p>
                            <p>{formatTime(office.normalBusinessHoursFrom)}</p>
                            <p>{formatTime(office.normalBusinessHoursTo)}</p>
                          </div>
                          <div className="flex gap-1 [&>p]:text-[1.2rem]">
                            <p>Събота:</p>
                            <p>{formatTime(office.halfDayBusinessHoursFrom)}</p>
                            <p>{formatTime(office.halfDayBusinessHoursTo)}</p>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </section>
  );
};
