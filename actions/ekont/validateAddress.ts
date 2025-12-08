'use server';
import { Buffer } from 'buffer';

export const validateAddress = async (data: any) => {
  const ekontApiKey = process.env.ECONT_API_KEY;
  const ekontUrl = process.env.EKONT_API_URL;

  const auth = Buffer.from(`${ekontApiKey}`).toString('base64');

  const addressData = {
    address: {
      city: {
        name: data?.city,
      },
      street: data?.street,
      num: data?.streetNumber,
      other: data?.other,
      postCode: data?.postCode,
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

  const validated = await res.json();
  // console.log('validate address', validated);

  return validated;
};
