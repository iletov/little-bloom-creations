'use server';

export const calculateLabel = async (
  sender: any,
  receiverNames: any,
  receiver: any,
  deliveryMethod: string | null,
) => {
  const ekontApiKey = process.env.ECONT_API_KEY;
  const ekontUrl = process.env.EKONT_API_URL;
  const auth = Buffer.from(`${ekontApiKey}`).toString('base64');

  const isDelivery = deliveryMethod === 'ekont-courier';
  const isPickup = deliveryMethod === 'ekont-office';

  const receiverFullName =
    receiverNames?.firstName + ' ' + receiverNames?.lastName;

  const receiverPhones = [receiver?.phoneNumber];
  const senderPhones = sender?.senderClient?.phones;

  const cityData = (city: string, postalCode: string | number) => ({
    name: city ?? '',
    postCode: postalCode ?? '',
    country: {
      code3: 'BGR',
    },
  });

  const senderCity = cityData(
    sender?.senderAddress?.city,
    sender?.senderAddress?.postCode,
  );

  const senderAddress = {
    city: senderCity,
    street: sender?.senderAddress?.street ?? '',
    num: sender?.senderAddress?.num ?? '',
    quarter: '',
    other: '',
  };

  const receiverCity = cityData(receiver?.city, receiver?.postalCode);

  const receiverAddress = {
    city: receiverCity,
    street: isDelivery ? (receiver?.street ?? '') : '',
    num: isDelivery ? (receiver?.streetNumber ?? '') : '',
    quarter: isDelivery ? (receiver?.quarter ?? '') : '',
    other: isDelivery ? (receiver?.other ?? '') : '',
  };

  const labelData = {
    label: {
      senderClient: {
        name: sender?.senderClient?.name,
        phones: senderPhones,
      },
      senderAddress,
      receiverClient: {
        name: receiverFullName,
        phones: receiverPhones,
      },
      receiverAddress,
      senderDeliveryType: sender?.senderDeliveryType,
      senderOfficeCode: sender?.senderOfficeCode,
      receiverOfficeCode: receiver?.officeCode || '',
      receiverDeliveryType: isPickup ? 'office' : 'delivery',
      packCount: 1,
      shipmentType: 'PACK',
      weight: 5,
    },
    mode: 'calculate',
  };

  try {
    console.log(
      'EKONT CALCULATE PRICE----->:',
      JSON.stringify(labelData, null, 2),
    );

    const res = await fetch(
      `${ekontUrl}/Shipments/LabelService.createLabel.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(labelData),
      },
    );

    if (!res.ok) {
      console.error(res);
      throw new Error(`Econt API calculateLabel error:`);
    }

    const data = await res.json();
    console.log('CALCULATE RES-->:', data);

    return data;
  } catch (error) {
    console.error('Error calculating label:', error);
  }
};
