import { ShippingEngineService } from './services/shipping-engine.service';
import { CalculateShippingUseCase } from './use-cases/calculate-shipping.use-case';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { DeliveryMethodEnum } from '@repo/shared-types';
export declare class ShippingController {
    private readonly shippingEngine;
    private readonly calculateShippingUseCase;
    constructor(shippingEngine: ShippingEngineService, calculateShippingUseCase: CalculateShippingUseCase);
    getCities(courier: DeliveryMethodEnum, countryCode?: string): Promise<import("./domain/models").CityDto[]>;
    getOffices(courier: DeliveryMethodEnum, cityId?: string): Promise<import("./domain/models").OfficeDto[]>;
    calculateShipping(dto: CalculateShippingDto): Promise<import("./domain/models").ShippingCalculationResult>;
}
