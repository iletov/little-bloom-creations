import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IShippingProvider } from '../interfaces/shipping-provider.interface';
import {
  Address,
  ShippingCalculationRequest,
  ShippingCalculationResult,
  CreateWaybillRequest,
  CreateWaybillResult,
  CityDto,
  EcontCityResponse,
  OfficeDto,
  EcontOfficeResponse,
} from '../domain/models';
import { ShippingProviderException } from '../domain/exceptions';
import { EcontLabelPayload, EcontLabelResponse } from './types/econt.types';
import { DeliveryMethodEnum, PaymentMethodEnum } from '@repo/shared-types';

// Strict Type Guard to safely discriminate the union type
function isCreateWaybillRequest(
  request: ShippingCalculationRequest | CreateWaybillRequest,
): request is CreateWaybillRequest {
  return 'senderInfo' in request;
}

@Injectable()
export class EcontShippingAdapter implements IShippingProvider {
  private readonly econtUrl = process.env.EKONT_API_URL || '';
  private readonly apiKey = process.env.ECONT_API_KEY || '';
  private readonly authHeader = `Basic ${Buffer.from(this.apiKey).toString('base64')}`;

  constructor(private readonly httpService: HttpService) {}

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: this.authHeader,
    };
  }

  async validateAddress(
    address: Address,
    postalCode?: string,
  ): Promise<boolean | Record<string, unknown>> {
    try {
      const payload = {
        address: {
          city: {
            postCode: postalCode || address.postalCode || '',
            name: address.city,
          },
          street: address.street || '',
          num: address.streetNumber || '',
          other: address.other || '',
        },
      };

      const response = await firstValueFrom(
        this.httpService.post<Record<string, unknown>>(
          `${this.econtUrl}/Nomenclatures/AddressService.validateAddress.json`,
          payload,
          { headers: this.getHeaders() },
        ),
      );
      return response.data;
    } catch (error: unknown) {
      throw new ShippingProviderException(
        'Failed to validate address with Econt',
        error,
      );
    }
  }

  private buildLabelPayload(
    request: ShippingCalculationRequest | CreateWaybillRequest,
    mode: 'calculate' | 'validate' | 'create',
  ): EcontLabelPayload {
    const isPickup = request.deliveryMethod === DeliveryMethodEnum.EKONT_OFFICE;
    const isCash = request.paymentMethod === PaymentMethodEnum.CASH;
    const isCreate = isCreateWaybillRequest(request);

    const senderClient = isCreate
      ? {
          name: request.senderInfo.name,
          phones: [request.senderInfo.phone],
          email: request.senderInfo.email,
        }
      : { name: 'SENDER', phones: ['0000000000'] };

    const services: Record<string, unknown> | null = isCash
      ? {
          cdType: 'GET',
          cdAmount: Number(request.totalAmount).toFixed(2),
          cdCurrency: 'BGN',
        }
      : null;

    const labelData: EcontLabelPayload = {
      label: {
        senderClient,
        senderAddress: request.senderAddress
          ? {
              city: {
                name: request.senderAddress.city,
                postCode: request.senderAddress.postalCode || '1000',
                country: { code3: 'BGR' },
              },
              street: request.senderAddress.street || '',
              num: request.senderAddress.streetNumber || '',
            }
          : {
              city: {
                name: 'Sofia',
                postCode: '1000',
                country: { code3: 'BGR' },
              },
              street: '',
              num: '',
            },
        receiverClient: {
          name:
            request.recipientInfo.clientName ||
            `${request.recipientInfo.firstName} ${request.recipientInfo.lastName}`,
          phones: [request.recipientInfo.phone],
        },
        receiverAddress: {
          city: {
            name: request.recipientAddress.city,
            postCode: request.recipientAddress.postalCode || '',
            country: { code3: 'BGR' },
          },
          street: !isPickup ? request.recipientAddress.street || '' : '',
          num: !isPickup ? request.recipientAddress.streetNumber || '' : '',
          quarter: !isPickup ? request.recipientAddress.quarter || '' : '',
          other: !isPickup ? request.recipientAddress.other || '' : '',
        },
        // Fallback to empty string safely respects the interface
        receiverOfficeCode:
          isPickup && request.recipientInfo.officeId
            ? String(request.recipientInfo.officeId)
            : '',
        receiverDeliveryType: isPickup ? 'office' : 'delivery',
        packCount: request.parcels.length > 0 ? request.parcels.length : 1,
        shipmentType: 'PACK',
        weight: request.totalWeight,
        services,
      },
      mode,
    };

    if (isCreate && request.shipmentDescription) {
      labelData.label.shipmentDescription = request.shipmentDescription;
      labelData.label.packingListType = 'digital';
      labelData.label.packingList = request.receiptItems || [];
    }

    return labelData;
  }

  async calculateShipping(
    request: ShippingCalculationRequest,
  ): Promise<ShippingCalculationResult> {
    try {
      const payload = this.buildLabelPayload(request, 'calculate');

      const response = await firstValueFrom(
        this.httpService.post<EcontLabelResponse>(
          `${this.econtUrl}/Shipments/LabelService.createLabel.json`,
          payload,
          { headers: this.getHeaders() },
        ),
      );

      const data = response.data;
      if (data?.label?.error) {
        throw new Error(JSON.stringify(data.label.error));
      }

      return {
        price: data?.label?.totalPrice || 0,
        rawDetails: data as unknown as Record<string, unknown>,
      };
    } catch (error: unknown) {
      throw new ShippingProviderException(
        'Failed to calculate shipping with Econt',
        error,
      );
    }
  }

  async createWaybill(
    request: CreateWaybillRequest,
  ): Promise<CreateWaybillResult> {
    try {
      const payload = this.buildLabelPayload(request, 'create');

      const response = await firstValueFrom(
        this.httpService.post<EcontLabelResponse>(
          `${this.econtUrl}/Shipments/LabelService.createLabel.json`,
          payload,
          { headers: this.getHeaders() },
        ),
      );

      const data = response.data;
      if (data?.label?.error) {
        throw new Error(JSON.stringify(data.label.error));
      }

      return {
        waybillNumber: data?.label?.shipmentNumber || '',
        price: data?.label?.totalPrice || 0,
        rawDetails: data as unknown as Record<string, unknown>,
      };
    } catch (error: unknown) {
      throw new ShippingProviderException(
        'Failed to create waybill with Econt',
        error,
      );
    }
  }

  async getCities(countryCode: string = 'BGR'): Promise<CityDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<{ cities: EcontCityResponse[] }>(
          `${this.econtUrl}/Nomenclatures/NomenclaturesService.getCities.json`,
          { countryCode },
          { headers: this.getHeaders() },
        ),
      );

      const cities = response.data.cities;
      return cities.map((city) => ({
        id: city.id,
        name: city.name,
        postCode: city.postCode,
        region: city.regionName || '',
      }));
    } catch (error) {
      throw new ShippingProviderException(
        'Failed to fetch cities from Econt',
        error,
      );
    }
  }

  async getOffices(cityId: string | number): Promise<OfficeDto[]> {
    try {
      const payload: Record<string, any> = { countryCode: 'BGR' };
      if (cityId) {
        payload.cityId = Number(cityId);
      }

      const response = await firstValueFrom(
        this.httpService.post<{ offices: EcontOfficeResponse[] }>(
          `${this.econtUrl}/Nomenclatures/NomenclaturesService.getOffices.json`,
          payload,
          { headers: this.getHeaders() },
        ),
      );

      const offices = response.data.offices || [];

      return offices.map((office) => ({
        id: office.id,
        name: office.name,
        address: office.address?.fullAddress || '',
        cityId: office.cityId,
      }));
    } catch (error: unknown) {
      throw new ShippingProviderException(
        'Failed to fetch offices from Econt',
        error,
      );
    }
  }
}
