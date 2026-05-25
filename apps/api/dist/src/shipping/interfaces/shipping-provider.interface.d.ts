import { Address, ShippingCalculationRequest, ShippingCalculationResult, CreateWaybillRequest, CreateWaybillResult, CityDto, OfficeDto } from '../domain/models';
export interface IShippingProvider {
    validateAddress(address: Address, postalCode?: string): Promise<boolean | Record<string, unknown>>;
    calculateShipping(request: ShippingCalculationRequest): Promise<ShippingCalculationResult>;
    createWaybill(request: CreateWaybillRequest): Promise<CreateWaybillResult>;
    getCities(countryCode?: string): Promise<CityDto[]>;
    getOffices(cityId?: string | number): Promise<OfficeDto[]>;
}
