'use server';

export const calculateLabelSpeedy = async (
  deliveryMethod: string,
  officeId: number | string | undefined,
  siteId: number,
) => {
  const speedyUrl = process.env.SPEEDY_BASE_URL;
  const userName = process.env.SPEEDY_USER;
  const password = process.env.SPEEDY_PASS;

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
    },
    content: {
      parcelsCount: 1,
      totalWeight: 0.6,
      // package: 'BOX',
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
