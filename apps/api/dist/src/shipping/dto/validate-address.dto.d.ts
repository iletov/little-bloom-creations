import { DeliveryMethodEnum } from '@repo/shared-types';
import { AddressDto } from './calculate-shipping.dto';
export declare class ValidateAddressDto {
    deliveryMethod: DeliveryMethodEnum;
    address: AddressDto;
    postalCode?: string;
}
