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
import React, { useEffect, useState } from 'react';
import { City } from '../checkout-forms/CheckoutForm';
import { getOffices } from '@/actions/ekont/getOffices';
import { Loader } from '@/component/loader/Loader';

interface Office {
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
  phones: string[];
  emails: string[];
}

interface CustomDropdownProps {
  placeholder?: string;
  className?: string;
  searchable?: boolean;
  disabled?: boolean;
  selectedCityData: City | undefined;
  onOfficeSelect?: (office: Office) => void;
}
export const OfficeDropdown = ({
  // options,
  placeholder = 'Select an option',
  className,
  searchable = true,
  disabled = false,
  selectedCityData,
  onOfficeSelect,
}: CustomDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!selectedCityData || !open) return;

    const loadOffices = async () => {
      try {
        setLoading(true);
        if (selectedCityData?.country?.code3 && selectedCityData?.id) {
          const data = await getOffices(
            selectedCityData.country.code3,
            selectedCityData.id,
          );
          setOffices(data || []);
        }
      } catch (error) {
        console.error('Failed to load offices:', error);
        setOffices([]);
      } finally {
        setLoading(false);
      }
    };

    loadOffices();
  }, [selectedCityData, open]);

  const handleSelect = (currentOffice: Office) => {
    setSelectedOffice(currentOffice);

    if (onOfficeSelect) {
      onOfficeSelect(currentOffice);
    }
    setOpen(false);
  };

  const filteredOffices = searchQuery
    ? offices.filter(office =>
        office.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : offices;

  return (
    <section className=" w-full relative space-y-2">
      <h3 className="text-lg mb-3 border-b-[2px] w-fit pb-2 font-montserrat bg">
        Изберете офис
      </h3>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between min-h-[2.85rem] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring font-montserrat',
              className,
            )}
            disabled={disabled || !selectedCityData}>
            {selectedOffice ? (
              <p className="flex gap-2 ">
                <span>{selectedOffice.name}</span>
                <span>({selectedOffice.code})</span>
              </p>
            ) : (
              <p className="text-muted-foreground ">{placeholder}</p>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="top"
          sideOffset={0}
          className="w-full max-w-[18rem] lg:min-w-[20rem] lg:max-w-[30rem] p-0 border-[1px] rounded-lg font-montserrat">
          <Command>
            {searchable && (
              <CommandInput
                placeholder="Search offices..."
                className="min-h-9 py-1 bg-foreground"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            )}
            <CommandList>
              {loading ? (
                <div className="w-full py-6 text-center text-sm text-gray-500">
                  <Loader />
                </div>
              ) : (
                <>
                  <CommandEmpty>No offices found.</CommandEmpty>
                  <CommandGroup className="max-h-72 overflow-auto ">
                    {filteredOffices.map(office => (
                      <CommandItem
                        key={office.id}
                        className="cursor-pointer border-b-[1px] py-1.5 data-[selected=true]:bg-primaryPurple"
                        value={office.name}
                        onSelect={() => handleSelect(office)}>
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedOffice?.id === office.id
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        <div className="flex flex-col items-start justify-center ">
                          <div className="flex gap-2 font-bold">
                            <p>{office.name}</p>
                            <p>({office.code})</p>
                          </div>
                          <div className="flex gap-1 ">
                            <p>{office.address.city.postCode},</p>
                            <p>{office.address.fullAddress}</p>
                          </div>
                          <p>{office.phones.map((phone: string) => phone)}</p>
                          <p>{office.emails.map((email: string) => email)}</p>
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
