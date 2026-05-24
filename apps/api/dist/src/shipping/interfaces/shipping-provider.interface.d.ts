import { Address, ShippingCalculationRequest, ShippingCalculationResult, CreateWaybillRequest, CreateWaybillResult } from '../domain/models';
export interface IShippingProvider {
    validateAddress(address: Address, postalCode?: string): Promise<boolean | Record<string, unknown>>;
    calculateShipping(request: ShippingCalculationRequest): Promise<ShippingCalculationResult>;
    createWaybill(request: CreateWaybillRequest): Promise<CreateWaybillResult>;
}
