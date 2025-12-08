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
import { useOfficesSpeedy } from '@/hooks/useOfficesSpeedy';

export interface OfficeSpeedy {
  id: string;
  name: string;
  address: {
    postCode: string;
    fullAddressString: string;
  };
  workingTimeFrom: string;
  workingTimeTo: string;
  workingTimeHalfFrom: string;
  workingTimeHalfTo: string;
}

interface CustomDropdownProps {
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  // selectedCityData: City | undefined;
  // onOfficeSelect?: (office: Office) => void;
}
export const OfficeDropdownSpeedy = ({
  // options,
  placeholder = 'Select option',
  className,
  disabled = false,
  // selectedCityData,
  // onOfficeSelect,
}: CustomDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { selectedOffice, setSelectedOffice, deliveryMethod, selectedCity } =
    useSenderDetails();
  const { addressFormData, updateAddresData, setDeliveryCost } = useCart();

  // console.log('# --selectedCity SPEEDY-->', selectedCity);

  const {
    speedyOffices,
    isLoading: isLoadingSpeedy,
    error: errorSpeedy,
  } = useOfficesSpeedy(selectedCity?.id, deliveryMethod === 'speedy-pickup');

  if (isLoadingSpeedy)
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    );

  if (errorSpeedy) return <p>faild to load offices</p>;

  const handleSelectOffice = async (currentOffice: OfficeSpeedy) => {
    setSelectedOffice(currentOffice);
    updateAddresData({ officeCode: currentOffice?.id } as AddressFormData);
    // setDeliveryCostFlag(true);
    setDeliveryCost(0);
    setOpen(false);
  };

  const filteredOffices = searchQuery
    ? speedyOffices?.filter(office =>
        office.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : speedyOffices;

  // console.log('# --addressFormData-->', addressFormData);

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
                <span>({selectedOffice.id})</span>
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
              {isLoadingSpeedy ? (
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
                            <p>({office.id})</p>
                          </div>
                          <div className="flex gap-1 [&>p]:text-[1.2rem]">
                            {/* <p>{office.address.postCode},</p> */}
                            <p>{office.address.fullAddressString}</p>
                          </div>
                          <div className="flex gap-1 [&>p]:text-[1.2rem]">
                            <p>Понеделник - Петък:</p>
                            <p>{office.workingTimeFrom}</p>
                            <p>{office.workingTimeTo}</p>
                          </div>
                          <div className="flex gap-1 [&>p]:text-[1.2rem]">
                            <p>Събота:</p>
                            <p>{office.workingTimeHalfFrom}</p>
                            <p>{office.workingTimeHalfTo}</p>
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
