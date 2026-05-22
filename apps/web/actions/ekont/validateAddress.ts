'use server';
import { Buffer } from 'buffer';

export const validateAddress = async (data: any, postalCode: string) => {
  const ekontApiKey = process.env.ECONT_API_KEY;
  const ekontUrl = process.env.EKONT_API_URL;

  const auth = Buffer.from(`${ekontApiKey}`).toString('base64');

  const validatePostCode = postalCode === data?.postalCode;

  if (!validatePostCode) {
    return {
      validationStatus: null,
      innerErrors: [
        {
          message: `Пощенският код не съвпада с избрания град. Очакван код: ${postalCode}`,
        },
      ],
    };
  }

  const addressData = {
    address: {
      city: {
        postCode: data?.postalCode,
        name: data?.city,
      },
      street: data?.street,
      num: data?.streetNumber,
      other: data?.other,
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

  console.log('validate address', data, JSON.stringify(addressData));

  const validated = await res.json();
  // console.log('validate address', validated);

  return validated;
};
