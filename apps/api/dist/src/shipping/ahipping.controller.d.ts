import { ShippingEngineService } from './services/shipping-engine.service';
import { DeliveryMethodEnum } from '@repo/shared-types';
export declare class ShippingController {
    private readonly shippingEngine;
    constructor(shippingEngine: ShippingEngineService);
    getCities(courier: DeliveryMethodEnum, countryCode?: string): Promise<import("./domain/models").CityDto[]>;
    getOffices(courier: DeliveryMethodEnum, cityId?: string): Promise<import("./domain/models").OfficeDto[]>;
}
