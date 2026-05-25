import { Injectable } from '@nestjs/common';
import { ShippingProviderFactory } from '../factories/shipping-provider.factory';
import {
  CityDto,
  CreateWaybillRequest,
  CreateWaybillResult,
  OfficeDto,
  ShippingCalculationRequest,
  ShippingCalculationResult,
} from '../domain/models';
import { DeliveryMethodEnum } from '@repo/shared-types';

@Injectable()
export class ShippingEngineService {
  constructor(private readonly factory: ShippingProviderFactory) {}

  async createWaybill(
    request: CreateWaybillRequest,
  ): Promise<CreateWaybillResult> {
    const provider = this.factory.getProvider(request.deliveryMethod);
    const result = await provider.createWaybill(request);

    return result;
  }

  async calculateShipping(
    request: ShippingCalculationRequest,
  ): Promise<ShippingCalculationResult> {
    const provider = this.factory.getProvider(request.deliveryMethod);
    const result = await provider.calculateShipping(request);

    return result;
  }

  async getCities(
    providerName: DeliveryMethodEnum,
    countryCode?: string,
  ): Promise<CityDto[]> {
    const provider = this.factory.getProvider(providerName);
    const result = await provider.getCities(countryCode);

    return result;
  }

  async getOffices(
    providerName: DeliveryMethodEnum,
    cityId?: string | number,
  ): Promise<OfficeDto[]> {
    const provider = this.factory.getProvider(providerName);
    const result = await provider.getOffices(cityId);

    return result;
  }
}
