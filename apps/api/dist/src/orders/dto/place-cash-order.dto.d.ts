import { DeliveryMethodEnum } from '@repo/shared-types';
export declare class OrderItemDto {
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
export declare class OrderAddressDto {
    city: string;
    postalCode?: string;
    street?: string;
    streetNumber?: string;
    quarter?: string;
    siteId?: number;
    country?: string;
}
export declare class OrderRecipientDto {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    officeId?: string;
}
export declare class PlaceCashOrderDto {
    items: OrderItemDto[];
    recipientAddress: OrderAddressDto;
    recipientInfo: OrderRecipientDto;
    deliveryMethod: DeliveryMethodEnum;
    totalAmount: number;
    deliveryCost: number;
    totalWeight: number;
    shipmentDescription?: string;
}
