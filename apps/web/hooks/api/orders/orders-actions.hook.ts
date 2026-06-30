import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiConfig } from '@/lib/api/api-config';

export interface OrderItemPayload {
  productId: string;
  variantId?: string;
  sku: string;
  variantSku?: string;
  name: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  weight: number;
  personalization?: Record<string, unknown>;
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

export interface PlaceOrderPayload {
  items: OrderItemPayload[];
  recipientAddress: AddressPayload;
  recipientInfo: RecipientPayload;
  deliveryMethod: string;
  totalAmount: number;
  deliveryCost: number;
  totalWeight: number;
}

export interface InitiateStripeOrderPayload extends PlaceOrderPayload {
  existingOrderNumber?: string;
  existingPaymentIntentId?: string;
}

export interface InitiateStripeOrderResponse {
  orderNumber: string;
  clientSecret: string;
  paymentIntentId: string;
}

export const useInitiateStripeOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: InitiateStripeOrderPayload,
    ): Promise<InitiateStripeOrderResponse> => {
      const response = await fetch(`${apiConfig.baseUrl}/orders/stripe/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: InitiateStripeOrderResponse & {
        message?: string;
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Failed to initiate Stripe order');
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate relevant queries like cart items if necessary
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const usePlaceCashOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PlaceOrderPayload) => {
      const response = await fetch(`${apiConfig.baseUrl}/orders/cash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Failed to place cash order');
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
