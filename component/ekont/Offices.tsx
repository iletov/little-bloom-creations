'use client';
import { getOffices } from '@/actions/ekont/getOffices';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Separator } from '../separator/Separator';
import { City } from '../checkout/checkout-forms/CheckoutForm';

type Office = {
  selectedCityData: City | undefined;
};
export const Offices = ({ selectedCityData }: Office) => {
  const [offices, setOffices] = useState([]);

  const [officeCode, setOfficeCode] = useState(Number);
  const [isOpen, setIsOpen] = useState(false);

  const handleSA = async () => {
    setIsOpen(true);
    if (selectedCityData) {
      const data = await getOffices(
        selectedCityData?.country?.code3,
        selectedCityData?.id,
      );
      setOffices(data.offices);
      console.log('---OFFICES---', data.offices);
    }
  };

  const handleOfficeClick = (code: number) => {
    if (officeCode === code) {
      // If the same code is clicked again, deselect it by setting to 0
      setOfficeCode(0);
    } else {
      // Otherwise, select the new code
      setOfficeCode(code);
    }
  };
  console.log('officeCode', officeCode);

  return (
    <section className="global-padding-sm ">
      <div className="flex gap-2">
        <Button variant={'default'} onClick={() => handleSA()}>
          Show Offices
        </Button>
      </div>

      {isOpen ? (
        <div className="max-h-[35vh] overflow-y-scroll mt-5 border-t-[1px] border-b-[1px] p-2 pr-5 shadow-md">
          {offices?.map((office: any) => (
            <div key={office.id}>
              <header className="flex gap-2 font-bold">
                <h2>{office.name}</h2>
                <p>({office.code})</p>
              </header>
              <div className="flex gap-1 ">
                <p>{office.hubCode},</p>
                <p>{office.address.fullAddress}</p>
              </div>
              <p>{office.phones.map((phone: string) => phone)}</p>
              <p>{office.emails.map((email: string) => email)}</p>
              <Button
                variant={officeCode !== office.code ? 'default' : 'outline'}
                onClick={() => handleOfficeClick(office.code)}>
                {officeCode !== office.code ? 'Add' : 'Remove'}
              </Button>
              <br />
              <Separator />
              <br />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};
