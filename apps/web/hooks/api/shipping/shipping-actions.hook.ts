import { useMutation } from '@tanstack/react-query';

export interface ParcelDimensionsPayload {
  seqNo: number;
  weight: number;
  width: number;
  height: number;
  depth: number;
  ref1?: string;
}

export interface AddressPayload {
  city?: string;
  postalCode?: string;
  street?: string;
  streetNumber?: string;
  quarter?: string;
  siteId?: number;
  streetId?: number;
  country?: string;
}

export interface RecipientPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  officeId?: string | number;
  officeName?: string;
}

export interface CalculateShippingPayload {
  deliveryMethod: string;
  paymentMethod: string;
  totalWeight: number;
  totalAmount: number;
  recipientAddress: AddressPayload;
  recipientInfo: RecipientPayload;
  parcels: ParcelDimensionsPayload[];
}

export const useCalculateShipping = () => {
  return useMutation({
    mutationFn: async (payload: CalculateShippingPayload) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        let errorMessage = data?.message || data?.error || 'Failed to calculate shipping cost';
        if (data?.rawError) {
          errorMessage += ' - Details: ' + (typeof data.rawError === 'object' ? JSON.stringify(data.rawError) : data.rawError);
        }
        throw new Error(errorMessage);
      }

      return data;
    },
  });
};
