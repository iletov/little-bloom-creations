export interface EcontLabelPayload {
  label: {
    senderClient: {
      name: string;
      phones: string[];
      email?: string;
    };
    senderAddress: {
      city: {
        name: string;
        postCode: string;
        country: { code3: string };
      };
      street: string;
      num: string;
    };
    receiverClient: {
      name: string;
      phones: string[];
    };
    receiverAddress: {
      city: {
        name: string;
        postCode: string;
        country: { code3: string };
      };
      street: string;
      num: string;
      quarter: string;
      other: string;
    };
    receiverOfficeCode: string | number;
    receiverDeliveryType: 'office' | 'delivery';
    packCount: number;
    shipmentType: 'PACK';
    weight: number;
    services: Record<string, unknown> | null;
    shipmentDescription?: string;
    packingListType?: string;
    packingList?: unknown[];
  };
  mode: 'calculate' | 'validate' | 'create';
}

export interface EcontLabelResponse {
  label: {
    shipmentNumber?: string;
    totalPrice?: number;
    error?: {
      message?: string;
      type?: string;
      innerErrors?: unknown[];
    };
  };
}
