import { ShippingProviderFactory } from '../factories/shipping-provider.factory';
import { CityDto, CreateWaybillRequest, CreateWaybillResult, OfficeDto, ShippingCalculationRequest, ShippingCalculationResult } from '../domain/models';
import { DeliveryMethodEnum } from '@repo/shared-types';
export declare class ShippingEngineService {
    private readonly factory;
    constructor(factory: ShippingProviderFactory);
    createWaybill(request: CreateWaybillRequest): Promise<CreateWaybillResult>;
    calculateShipping(request: ShippingCalculationRequest): Promise<ShippingCalculationResult>;
    getCities(providerName: DeliveryMethodEnum, countryCode?: string): Promise<CityDto[]>;
    getOffices(providerName: DeliveryMethodEnum, cityId?: string | number): Promise<OfficeDto[]>;
}
