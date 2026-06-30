import { DeliveryMethodEnum, PaymentMethodEnum } from '@repo/shared-types';
export declare class AddressDto {
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
export declare class ParcelDimensionsDto {
    seqNo: number;
    weight: number;
    width: number;
    height: number;
    depth: number;
    ref1?: string;
}
export declare class RecipientInfoDto {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    officeId?: string | number;
    clientName?: string;
}
export declare class CalculateShippingDto {
    deliveryMethod: DeliveryMethodEnum;
    paymentMethod: PaymentMethodEnum | null;
    totalWeight: number;
    totalAmount: number;
    recipientAddress: AddressDto;
    recipientInfo: RecipientInfoDto;
    parcels: ParcelDimensionsDto[];
    senderAddress?: AddressDto;
}
