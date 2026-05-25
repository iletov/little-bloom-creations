import { HttpService } from '@nestjs/axios';
import { IShippingProvider } from '../interfaces/shipping-provider.interface';
import { Address, ShippingCalculationRequest, ShippingCalculationResult, CreateWaybillRequest, CreateWaybillResult, CityDto, OfficeDto } from '../domain/models';
export declare class EcontShippingAdapter implements IShippingProvider {
    private readonly httpService;
    private readonly econtUrl;
    private readonly apiKey;
    private readonly authHeader;
    constructor(httpService: HttpService);
    private getHeaders;
    validateAddress(address: Address, postalCode?: string): Promise<boolean | Record<string, unknown>>;
    private buildLabelPayload;
    calculateShipping(request: ShippingCalculationRequest): Promise<ShippingCalculationResult>;
    createWaybill(request: CreateWaybillRequest): Promise<CreateWaybillResult>;
    getCities(countryCode?: string): Promise<CityDto[]>;
    getOffices(cityId: string | number): Promise<OfficeDto[]>;
}
