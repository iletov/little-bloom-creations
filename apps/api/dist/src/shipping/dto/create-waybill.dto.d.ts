import { CalculateShippingDto } from './calculate-shipping.dto';
export declare class SenderInfoDto {
    name: string;
    phone: string;
    email?: string;
}
export declare class ReceiptItemDto {
    name: string;
    price: number;
    quantity: number;
}
export declare class CreateWaybillDto extends CalculateShippingDto {
    senderInfo: SenderInfoDto;
    shipmentDescription?: string;
    receiptItems?: ReceiptItemDto[];
}
