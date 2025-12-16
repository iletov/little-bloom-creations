'use server';

import { ReceiptItem } from '@/lib/utils/createReceiptFromItems';

export type parcelsType = {
  seqNo: number;
  size: { width: number; height: number; depth: number };
  weight: number;
  ref1: string;
};

export const calculateLabelSpeedy = async (
  deliveryMethod: string,
  paymentMethod: string | null,
  officeId: number | string | undefined,
  siteId: number,
  totalAmount: number,
  parcels: parcelsType[],
  receipt: ReceiptItem[],
) => {
  const speedyUrl = process.env.SPEEDY_BASE_URL;
  const userName = process.env.SPEEDY_USER;
  const password = process.env.SPEEDY_PASS;

  const isPaymentCash = paymentMethod === 'cash';

  const recipient =
    deliveryMethod === 'speedy-pickup'
      ? {
          privatePerson: true,
          pickupOfficeId: officeId,
        }
      : {
          privatePerson: true,
          addressLocation: {
            siteId: siteId,
          },
        };

  const additionalServices = isPaymentCash
    ? {
        cod: {
          amount: totalAmount,
          processingType: 'CASH',
          payoutToLoggedClient: true,
          fiscalReceiptItems: receipt,
        },
        obpd: {
          option: 'OPEN',
          returnShipmentServiceId: 505,
          returnShipmentPayer: 'SENDER',
        },
        declaredValue: {
          amount: totalAmount,
          fragile: true,
        },
      }
    : {
        obpd: {
          option: 'OPEN',
          returnShipmentServiceId: 505,
          returnShipmentPayer: 'SENDER',
        },
        declaredValue: {
          amount: totalAmount,
          fragile: true,
        },
      };

  const labelData = {
    userName,
    password,
    sender: {
      clientId: 9999999998000,
    },
    recipient,
    service: {
      autoAdjustPickupDate: true,
      serviceIds: [505],
      additionalServices,
    },
    content: {
      parcelsCount: parcels.length,
      parcels,
      // totalWeight: 0.6,
      package: 'ENVELOP',
      contents: 'КАНЦ. МАТЕР.',
    },
    payment: {
      courierServicePayer: 'RECIPIENT',
      declaredValuePayer: 'RECIPIENT',
    },
  };

  console.log('CALCULATE LABEL DATA----->:', JSON.stringify(labelData));

  try {
    const res = await fetch(`${speedyUrl}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(labelData),
    });

    if (!res.ok) {
      throw new Error(`Speedy API calculateLabel error: ${res.statusText}`);
    }

    const data = await res.json();
    // console.log('SPEEDY PRICE----->:', data?.calculations[0]?.price?.total);

    return data?.calculations[0];
  } catch (error) {
    console.error('Error calculating label:', error);
    return null;
  }
};
