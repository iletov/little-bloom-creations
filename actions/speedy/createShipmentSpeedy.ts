'use server';

export const createShipmentSpeedy = async (
  senderData: any,
  recipientData: any,
  addressData: any,
  deliveryMethod: string,
  paymentMethod: string,
  officeId: number,
  siteId: number,
  streetId: number,
  totalAmount: number,
) => {
  const speedyUrl = process.env.SPEEDY_BASE_URL;
  const userName = process.env.SPEEDY_USER;
  const password = process.env.SPEEDY_PASS;

  const isPaymentCash = paymentMethod === 'cash';

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

  const additionalServices = isPaymentCash
    ? {
        cod: {
          amount: totalAmount,
          processingType: 'CASH',
          payoutToLoggedClient: true,
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

  const shipmentData = {
    userName,
    password,
    sender: {
      clientId: '9999999998000',
      phone1: {
        number: '0888112233',
      },
      contactName: 'IVAN PETROV',
      email: 'ivan@petrov.bg',
    },
    recipient,

    service: {
      autoAdjustPickupDate: true,
      serviceId: 505,
      saturdayDelivery: true,
      additionalServices,
    },

    content: {
      parcelsCount: 1,
      contents: 'STATIONERY GOODS',
      package: 'BOX',
      totalWeight: 0.6,
    },
    payment: {
      courierServicePayer: 'RECIPIENT',
      declaredValuePayer: 'RECIPIENT',
    },
  };

  console.log('# --Speedy INITIALISE Shipment Data-->', shipmentData);

  try {
    const res = await fetch(`${speedyUrl}/shipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentData),
    });

    if (!res.ok) {
      throw new Error(`Speedy API calculateLabel error: ${res.statusText}`);
    }

    const data = await res.json();

    console.log('# --Speedy CREATE Shipment Data-->', data);

    return data;
  } catch (error) {
    console.error('Error calculating label:', error);
    return null;
  }
};
