import { Injectable } from '@nestjs/common';
import { ShippingProviderFactory } from '../factories/shipping-provider.factory';
import {
  Address,
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
    
    // First, strictly validate the shipment address and details
    if (provider.validateShipment) {
      await provider.validateShipment(request);
    }

    const result = await provider.calculateShipping(request);

    return result;
  }

  async validateAddress(
    providerName: DeliveryMethodEnum,
    address: Address,
    postalCode?: string,
  ): Promise<boolean | Record<string, unknown>> {
    const provider = this.factory.getProvider(providerName);
    return provider.validateAddress(address, postalCode);
  }

  async getCities(
    providerName: DeliveryMethodEnum,
    countryCode?: string,
    search?: string,
  ): Promise<CityDto[]> {
    const provider = this.factory.getProvider(providerName);
    const result = await provider.getCities(countryCode, search);

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
