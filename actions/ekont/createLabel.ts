'use server';

export const createLabel = async (
  sender: any,
  receiverNames: any,
  receiver: any,
  totalPrice: number,
  deliveryMethod: string | null,
  paymentMethod: string = '',
  create: boolean = false,
) => {
  const ekontApiKey = process.env.ECONT_API_KEY;
  const ekontUrl = process.env.EKONT_API_URL;
  const auth = Buffer.from(`${ekontApiKey}`).toString('base64');

  const isDelivery =
    deliveryMethod === 'ekont-courier' || deliveryMethod === 'delivery';
  const isPickup =
    deliveryMethod === 'ekont-office' || deliveryMethod === 'office';
  const isPaymentCash = paymentMethod === 'cash';

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
      payAfterAccept: sender?.payAfterAccept,
      payAfterTest: sender?.payAfterTest,
      packCount: 1,
      shipmentType: 'PACK',
      weight: 5,
      shipmentDescription: sender?.shipmentDescription || '18273187246',
      paymentSenderMethod: sender?.paymentSenderMethod || '',
      paymentSenderAmount: sender?.paymentSenderAmount || '',
      paymentReceiverMethod: sender?.paymentReceiverMethod || '',
      paymentReceiverAmount: sender?.paymentReceiverAmount || '',
      aymentReceiverAmountIsPercent: sender?.paymentReceiverAmountIsPercent,
      services: isPaymentCash && {
        cdType: isPaymentCash ? 'GET' : '',
        cdAmount: isPaymentCash ? totalPrice : '',
        cdCurrency: isPaymentCash ? 'EUR' : '',

        cdPayOptionsTemplate: !sender?.cdPayOptionsVariants
          ? sender?.cdPayOptionsTemplate
          : '',

        cdPayOptions: sender?.cdPayOptionsVariants
          ? {
              client: {
                name: isPaymentCash ? sender?.senderClient?.name : '',
                phones: isPaymentCash ? sender?.senderClient?.phones : '',
              },
              method: isPaymentCash ? sender?.cdOptions?.method : '',
              BIC: isPaymentCash ? sender?.cdOptions?.bic : '',
              IBAN: isPaymentCash ? sender?.cdOptions?.iban : '',
              bankCurrency: isPaymentCash ? 'EUR' : '',
              payDays: isPaymentCash ? 1 : '',
              // "payWeekdays":"monday"
              officeCode:
                sender?.senderOfficeCode && isPaymentCash
                  ? sender?.senderOfficeCode
                  : '',
            }
          : '',
      },
      instructions: {
        returnInstructionParams: {
          type: 'return',
          returnParcelDestination: 'office',
          returnParcelPaymentSide: 'receiver',
          returnParcelReceiverOfficeCode: '',
        },
      },
    },
    // mode: !paymentMethod ? 'calculate' : 'validate',
    mode:
      paymentMethod && !create
        ? 'validate'
        : !!paymentMethod && !!create && 'create',
  };

  try {
    console.log('VALIDATE LABEL----->:', JSON.stringify(labelData, null, 2));

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
      throw new Error(`Econt API calculateLabel error`);
    }

    const data = await res.json();
    console.log('Label----> ', data);
    return data;
  } catch (error) {
    console.error('Error calculating label:', error);
  }
};
