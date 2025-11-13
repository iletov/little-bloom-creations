'use server';

export const calculateLabel = async (
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

  const bodyData = {
    label: {
      senderClient: {
        name: sender?.senderClient?.name,
        phones: sender?.senderClient?.phones,
      },
      senderAddress: {
        city: {
          country: {
            code3: 'BGR',
          },
          name: sender?.senderAddress?.city,
          postCode: sender?.senderAddress?.postCode,
        },
        street: sender?.senderAddress?.street,
        num: sender?.senderAddress?.num,
        quarter: '',
        other: '',
      },
      receiverClient: {
        name: receiverNames?.firstName + ' ' + receiverNames?.lastName || '',

        phones: [receiver?.phoneNumber],
      },
      receiverAddress: {
        city: {
          name: receiver?.city ?? '',
          postCode:
            deliveryMethod === 'ekont-courier' || deliveryMethod === 'delivery'
              ? (receiver?.postalCode ?? '')
              : '',
          country: {
            code3: 'BGR',
          },
        },
        street:
          deliveryMethod === 'ekont-courier' || deliveryMethod === 'delivery'
            ? (receiver?.street ?? '')
            : '',
        num:
          deliveryMethod === 'ekont-courier' || deliveryMethod === 'delivery'
            ? (receiver?.streetNumber ?? '')
            : '',
        quarter:
          deliveryMethod === 'ekont-courier' || deliveryMethod === 'delivery'
            ? (receiver?.quarter ?? '')
            : '',
        other:
          deliveryMethod === 'ekont-courier' || deliveryMethod === 'delivery'
            ? (receiver?.other ?? '')
            : '',
      },
      senderDeliveryType: sender?.senderDeliveryType,
      senderOfficeCode: sender?.senderOfficeCode || '',
      receiverOfficeCode: receiver?.officeCode || '',
      receiverDeliveryType:
        deliveryMethod === 'ekont-office' || deliveryMethod === 'office'
          ? 'office'
          : 'delivery',
      payAfterAccept: sender?.payAfterAccept,
      payAfterTest: sender?.payAfterTest,
      packCount: 1,
      shipmentType: 'PACK',
      weight: 5,
      shipmentDescription: sender?.shipmentDescription || '',
      paymentSenderMethod: sender?.paymentSenderMethod || '',
      paymentSenderAmount: sender?.paymentSenderAmount || '',
      paymentReceiverMethod: sender?.paymentReceiverMethod || '',
      paymentReceiverAmount: sender?.paymentReceiverAmount || '',
      aymentReceiverAmountIsPercent: sender?.paymentReceiverAmountIsPercent,
      services: {
        cdType: paymentMethod === 'cash' ? 'GET' : '',
        cdAmount: paymentMethod === 'cash' ? totalPrice : '',
        cdCurrency: paymentMethod === 'cash' ? 'BGN' : '',
        cdPayOptions: {
          client: {
            name: paymentMethod === 'cash' ? sender?.senderClient?.name : '',
            phones:
              paymentMethod === 'cash' ? sender?.senderClient?.phones : '',
          },
          method: paymentMethod === 'cash' ? sender?.cdOptions?.method : '',
          BIC: paymentMethod === 'cash' ? sender?.cdOptions?.bic : '',
          IBAN: paymentMethod === 'cash' ? sender?.cdOptions?.iban : '',
          bankCurrency: paymentMethod === 'cash' ? 'BGN' : '',
          payDays: paymentMethod === 'cash' ? 3 : '',
          // "payWeekdays":"monday"
          officeCode:
            sender?.senderOfficeCode && paymentMethod === 'cash'
              ? sender?.senderOfficeCode
              : '',
        },
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
      !paymentMethod && !create
        ? 'calculate'
        : paymentMethod && !create
          ? 'validate'
          : !!paymentMethod && !!create && 'create',
  };

  try {
    console.log('EKONT SENDER----->:', JSON.stringify(bodyData, null, 2));

    const res = await fetch(
      `${ekontUrl}/Shipments/LabelService.createLabel.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(bodyData),
      },
    );

    if (!res.ok) {
      console.log(`Econt API calculateLabel error: ${res.status}`);
      throw new Error(`Econt API calculateLabel error`);
    }

    const data = await res.json();
    // console.log('Label----> ', data);
    return data;
  } catch (error) {
    console.error('Error calculating label:', error);
  }
};
