import { HttpService } from '@nestjs/axios';
import { IShippingProvider } from '../interfaces/shipping-provider.interface';
import { Address, ShippingCalculationRequest, ShippingCalculationResult, CreateWaybillRequest, CreateWaybillResult, CityDto, OfficeDto } from '../domain/models';
export declare class SpeedyShippingAdapter implements IShippingProvider {
    private readonly httpService;
    private readonly speedyUrl;
    private readonly userName;
    private readonly password;
    constructor(httpService: HttpService);
    validateAddress(address: Address): Promise<boolean | Record<string, unknown>>;
    private buildBasePayload;
    validateShipment(request: ShippingCalculationRequest): Promise<void>;
    calculateShipping(request: ShippingCalculationRequest): Promise<ShippingCalculationResult>;
    createWaybill(request: CreateWaybillRequest): Promise<CreateWaybillResult>;
    getCities(countryCode?: string, search?: string): Promise<CityDto[]>;
    getOffices(cityId?: string | number): Promise<OfficeDto[]>;
}
