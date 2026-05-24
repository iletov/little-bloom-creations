import { DeliveryMethodEnum, PaymentMethodEnum } from '@repo/shared-types';
export interface Address {
    city: string;
    postalCode?: string;
    street?: string;
    streetNumber?: string;
    quarter?: string;
    other?: string;
    siteId?: number;
    streetId?: number;
    blockNo?: string;
    entranceNo?: string;
    floorNo?: string;
    apartmentNo?: string;
}
export interface ParcelDimensions {
    seqNo: number;
    weight: number;
    width: number;
    height: number;
    depth: number;
    ref1?: string;
}
export interface RecipientInfo {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    officeId?: number | string;
    clientName?: string;
}
export interface SenderInfo {
    name: string;
    phone: string;
    email?: string;
}
export interface ShippingCalculationRequest {
    deliveryMethod: DeliveryMethodEnum;
    paymentMethod: PaymentMethodEnum | null;
    totalWeight: number;
    totalAmount: number;
    recipientAddress: Address;
    recipientInfo: RecipientInfo;
    parcels: ParcelDimensions[];
    senderAddress?: Address;
}
export interface CreateWaybillRequest extends ShippingCalculationRequest {
    senderInfo: SenderInfo;
    shipmentDescription?: string;
    receiptItems?: Array<{
        name: string;
        price: number;
        quantity: number;
    }>;
}
export interface ShippingCalculationResult {
    price: number;
    rawDetails: Record<string, unknown>;
}
export interface CreateWaybillResult {
    waybillNumber: string;
    price: number;
    rawDetails: Record<string, unknown>;
}
