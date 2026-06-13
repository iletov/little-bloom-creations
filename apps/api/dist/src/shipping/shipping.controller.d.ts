import { ShippingEngineService } from './services/shipping-engine.service';
import { CalculateShippingUseCase } from './use-cases/calculate-shipping.use-case';
import { ValidateAddressUseCase } from './use-cases/validate-address.use-case';
import { CreateWaybillUseCase } from './use-cases/create-waybill.use-case';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { ValidateAddressDto } from './dto/validate-address.dto';
import { CreateWaybillDto } from './dto/create-waybill.dto';
import { DeliveryMethodEnum } from '@repo/shared-types';
export declare class ShippingController {
    private readonly shippingEngine;
    private readonly calculateShippingUseCase;
    private readonly validateAddressUseCase;
    private readonly createWaybillUseCase;
    constructor(shippingEngine: ShippingEngineService, calculateShippingUseCase: CalculateShippingUseCase, validateAddressUseCase: ValidateAddressUseCase, createWaybillUseCase: CreateWaybillUseCase);
    getCities(courier: DeliveryMethodEnum, countryCode?: string): Promise<import("./domain/models").CityDto[]>;
    getOffices(courier: DeliveryMethodEnum, cityId?: string): Promise<import("./domain/models").OfficeDto[]>;
    calculateShipping(dto: CalculateShippingDto): Promise<import("./domain/models").ShippingCalculationResult>;
    validateAddress(dto: ValidateAddressDto): Promise<boolean | Record<string, unknown>>;
    createWaybill(dto: CreateWaybillDto): Promise<import("./domain/models").CreateWaybillResult>;
}
