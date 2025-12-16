'use server';

import { parcelsType } from './calculateLabelSpeedy';

export const validateAddressSpeedy = async (
  recipientData: any,
  addressData: any,
  deliveryMethod: string,
  officeId: number,
  siteId: number,
  streetId: number,
  parcels: parcelsType[],
) => {
  const speedyUrl = process.env.SPEEDY_BASE_URL;
  const userName = process.env.SPEEDY_USER;
  const password = process.env.SPEEDY_PASS;

  const recipient =
    deliveryMethod === 'speedy-pickup'
      ? {
          phone1: {
            number: addressData?.phoneNumber,
          },
          privatePerson: true,
          clientName: recipientData?.clientName,
          email: recipientData?.email,
          pickupOfficeId: officeId,
        }
      : {
          phone1: {
            number: addressData?.phoneNumber,
          },
          privatePerson: true,
          clientName: recipientData?.clientName,
          email: recipientData?.email,
          address: {
            siteId,
            streetId,
            streetNo: addressData?.streetNumber,
            blockNo: addressData?.blockNo,
            entranceNo: addressData?.entranceNo,
            floorNo: addressData?.floorNo,
            apartmentNo: addressData?.apartmentNo,
          },
        };

  const data = {
    userName,
    password,
    recipient,
    service: {
      autoAdjustPickupDate: true,
      serviceId: 505,
      saturdayDelivery: true,
    },
    content: {
      parcelsCount: parcels.length,
      parcels,
      contents: 'КАНЦ. МАТЕР.',
      package: 'ENVELOP',
    },
    payment: {
      courierServicePayer: 'RECIPIENT',
      declaredValuePayer: 'RECIPIENT',
    },
  };

  console.log('# --Speedy Validation Data', JSON.stringify(data));

  const res = await fetch(`${speedyUrl}/validation/shipment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const validated = await res.json();
  console.log('validate address', validated);

  return validated;
};
