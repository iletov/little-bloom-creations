'use server';

export const calculateLabelSpeedy = async (
  deliveryMethod: string,
  paymentMethod: string | null,
  officeId: number | string | undefined,
  siteId: number,
  totalAmount: number,
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
          fiscalReceiptItems: [
            //TODO: handle fiscalReceiptItems
            {
              description: 'Shoes',
              vatGroup: 'Б',
              amount: '50',
              amountWithVat: '60',
            },
          ],
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

  //TODO handle parcels
  const parcels = [
    {
      seqNo: 1,
      size: {
        width: 10,
        height: 30,
        depth: 20,
      },
      weight: 0.5,
      // "ref1": "ORDER 123456, 1st Box"
    },
    {
      seqNo: 2,
      size: {
        width: 10,
        height: 30,
        depth: 20,
      },
      weight: 1.05,
      // "ref1": "ORDER 123456, 1st Box"
    },
  ];

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
      // parcelsCount: 1,
      parcels,
      // totalWeight: 0.6,
      // package: 'ENVELOP',
      // contents: 'Other',
    },
    payment: {
      courierServicePayer: 'RECIPIENT',
      declaredValuePayer: 'RECIPIENT',
    },
  };

  // console.log('LABEL DATA----->:', JSON.stringify(labelData));

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
