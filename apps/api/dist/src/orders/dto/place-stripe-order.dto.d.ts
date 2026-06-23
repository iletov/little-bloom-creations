import { PlaceCashOrderDto } from './place-cash-order.dto';
export declare class PlaceStripeOrderDto extends PlaceCashOrderDto {
    existingOrderNumber?: string;
    existingPaymentIntentId?: string;
}
