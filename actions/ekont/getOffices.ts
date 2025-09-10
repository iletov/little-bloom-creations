'use server';
import { Buffer } from 'buffer';

export const getOffices = async (
  code: string | undefined,
  cityId: string | undefined,
) => {
  const ekontApiKey = process.env.ECONT_API_KEY;
  const ekontUrl = process.env.EKONT_API_URL;
  const auth = Buffer.from(`${ekontApiKey}`).toString('base64');

  const bodyData = {
    countryCode: code,
    cityID: cityId,
  };

  const res = await fetch(
    `${ekontUrl}/Nomenclatures/NomenclaturesService.getOffices.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(bodyData),
    },
  );

  const data = await res.json();

  const offices = data.offices.filter((office: any) => office.isAPS == false);

  return offices;
};
