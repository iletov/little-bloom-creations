import { HttpService } from '@nestjs/axios';
import { IShippingProvider } from '../interfaces/shipping-provider.interface';
import { Address, ShippingCalculationRequest, ShippingCalculationResult, CreateWaybillRequest, CreateWaybillResult } from '../domain/models';
export declare class SpeedyShippingAdapter implements IShippingProvider {
    private readonly httpService;
    private readonly speedyUrl;
    private readonly userName;
    private readonly password;
    constructor(httpService: HttpService);
    validateAddress(address: Address): Promise<boolean | Record<string, unknown>>;
    private buildBasePayload;
    calculateShipping(request: ShippingCalculationRequest): Promise<ShippingCalculationResult>;
    createWaybill(request: CreateWaybillRequest): Promise<CreateWaybillResult>;
}
