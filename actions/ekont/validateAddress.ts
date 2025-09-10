'use server';
import { Buffer } from 'buffer';

export const validateAddress = async (
  city: string | undefined,
  street: string | undefined,
  streetNumber: string | undefined,
  other: string | undefined,
  postCode: string | undefined,
) => {
  const ekontApiKey = process.env.ECONT_API_KEY;
  const ekontUrl = process.env.EKONT_API_URL;

  const auth = Buffer.from(`${ekontApiKey}`).toString('base64');

  const addressData = {
    address: {
      city: {
        name: city,
      },
      street,
      num: streetNumber,
      other,
      postCode,
    },
  };

  const res = await fetch(
    `${ekontUrl}/Nomenclatures/AddressService.validateAddress.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(addressData),
    },
  );

  const data = await res.json();
  console.log('validate address', data);

  return data;
};
