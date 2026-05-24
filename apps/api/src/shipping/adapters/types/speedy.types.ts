export interface SpeedyPayload {
  userName?: string;
  password?: string;
  sender?: {
    clientId: number | string;
    contactName?: string;
    email?: string;
    phone1?: { number: string };
  };
  recipient: {
    privatePerson: boolean;
    clientName?: string;
    phone1?: { number: string };
    email?: string;
    pickupOfficeId?: number | string;
    address?: {
      siteId?: number;
      streetId?: number;
      streetNo?: string;
      blockNo?: string;
      entranceNo?: string;
      floorNo?: string;
      apartmentNo?: string;
    };
    addressLocation?: {
      siteId?: number;
    };
  };
  service: {
    autoAdjustPickupDate: boolean;
    serviceId?: number;
    serviceIds?: number[];
    saturdayDelivery?: boolean;
    additionalServices?: Record<string, unknown>;
  };
  content: {
    parcelsCount: number;
    parcels: unknown[];
    contents: string;
    package: string;
  };
  payment: {
    courierServicePayer: string;
    declaredValuePayer: string;
  };
}

export interface SpeedyCalculateResponse {
  calculations: Array<{
    price: {
      total: number;
    };
  }>;
}

export interface SpeedyShipmentResponse {
  id?: string;
  shipmentId?: string;
  price?: {
    total: number;
  };
}
