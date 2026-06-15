import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
  SpeedyCityResponse,
  OfficeDto,
  SpeedyOfficeResponse,
} from '../domain/models';
import { ShippingProviderException } from '../domain/exceptions';
import {
  SpeedyPayload,
  SpeedyCalculateResponse,
  SpeedyShipmentResponse,
} from './types/speedy.types';
import { DeliveryMethodEnum, PaymentMethodEnum } from '@repo/shared-types';
import { lastValueFrom } from 'rxjs';

// Strict Type Guard to safely discriminate the union type
function isCreateWaybillRequest(
  request: ShippingCalculationRequest | CreateWaybillRequest,
): request is CreateWaybillRequest {
  return 'senderInfo' in request;
}

@Injectable()
export class SpeedyShippingAdapter implements IShippingProvider {
  private readonly speedyUrl = process.env.SPEEDY_BASE_URL || '';
  private readonly userName = process.env.SPEEDY_USER || '';
  private readonly password = process.env.SPEEDY_PASS || '';

  constructor(private readonly httpService: HttpService) {}

  async validateAddress(
    address: Address,
  ): Promise<boolean | Record<string, unknown>> {
    try {
      const payload = {
        userName: this.userName,
        password: this.password,
        siteId: address.siteId,
        name: address.street || address.city,
      };

      const response = await firstValueFrom(
        this.httpService.post<Record<string, unknown>>(
          `${this.speedyUrl}/location/street`,
          payload,
        ),
      );
      return response.data;
    } catch (error: any) {
      console.error('Speedy API Error:', error?.response?.data || error?.message || error);
      throw new ShippingProviderException(
        'Failed to validate address with Speedy',
        error?.response?.data || error?.message || {},
      );
    }
  }

  private buildBasePayload(
    request: ShippingCalculationRequest | CreateWaybillRequest,
  ): SpeedyPayload {
    const isPickup =
      request.deliveryMethod === DeliveryMethodEnum.SPEEDY_OFFICE;
    const isCash = request.paymentMethod === PaymentMethodEnum.CASH;
    const isCreate = isCreateWaybillRequest(request);

    const recipient: SpeedyPayload['recipient'] = {
      privatePerson: true,
      clientName:
        request.recipientInfo.clientName ||
        `${request.recipientInfo.firstName} ${request.recipientInfo.lastName}`,
      phone1: { number: request.recipientInfo.phone },
      email: request.recipientInfo.email,
    };

    if (isPickup) {
      recipient.pickupOfficeId = request.recipientInfo.officeId;
    } else {
      recipient.address = {
        siteId: request.recipientAddress.siteId,
        addressNote: `${request.recipientAddress.street || ''} ${request.recipientAddress.streetNumber || ''}`.trim(),
        ...(request.recipientAddress['streetId'] && request.recipientAddress.streetNumber
          ? { 
              streetId: request.recipientAddress['streetId'],
              streetNo: request.recipientAddress.streetNumber 
            }
          : {}),
      };
      recipient.addressLocation = { siteId: request.recipientAddress.siteId };
    }

    const additionalServices: Record<string, unknown> = {
      obpd: {
        option: 'OPEN',
        returnShipmentServiceId: 505,
        returnShipmentPayer: 'SENDER',
      },
      declaredValue: {
        amount: request.totalAmount,
        fragile: true,
      },
    };

    if (isCash) {
      additionalServices.cod = {
        amount: request.totalAmount,
        processingType: 'CASH',
        payoutToLoggedClient: true,
        fiscalReceiptItems: isCreate ? request.receiptItems || [] : [],
      };
    }

    return {
      userName: this.userName,
      password: this.password,
      recipient,
      service: {
        autoAdjustPickupDate: true,
        serviceId: 505,
        serviceIds: [505],
        saturdayDelivery: true,
        additionalServices,
      },
      content: {
        parcelsCount: request.parcels.length,
        parcels: request.parcels,
        contents:
          isCreate && request.shipmentDescription
            ? request.shipmentDescription
            : 'КАНЦ. МАТЕР.',
        package: 'ENVELOP',
      },
      payment: {
        courierServicePayer: 'RECIPIENT',
        declaredValuePayer: 'RECIPIENT',
      },
      sender: {
        dropoffOfficeId: 275,
        phone1: { number: '0888112233' },
        contactName: 'IVAN PETROV',
        email: 'ivan@petrov.bg',
      },
    };
  }

  async validateShipment(request: ShippingCalculationRequest): Promise<void> {
    try {
      const payload = this.buildBasePayload(request);

      const response = await firstValueFrom(
        this.httpService.post<Record<string, unknown>>(
          `${this.speedyUrl}/validation/shipment`,
          payload,
        ),
      );

      if (response.data?.error) {
        throw new Error(JSON.stringify(response.data.error));
      }
    } catch (error: any) {
      console.error('Speedy Validation Error:', error?.response?.data || error?.message || error);
      throw new ShippingProviderException(
        'Failed to validate shipment with Speedy',
        error?.response?.data || error?.message || {},
      );
    }
  }

  async calculateShipping(
    request: ShippingCalculationRequest,
  ): Promise<ShippingCalculationResult> {
    try {
      const payload = this.buildBasePayload(request);

      const response = await firstValueFrom(
        this.httpService.post<SpeedyCalculateResponse>(
          `${this.speedyUrl}/calculate`,
          payload,
        ),
      );

      // console.log('Speedy API Response Data:', JSON.stringify(response.data, null, 2));

      const calculations = response.data?.calculations;
      if (!calculations || calculations.length === 0) {
        throw new Error('No calculations returned from Speedy');
      }

      return {
        price: calculations[0].price.total,
        rawDetails: calculations[0] as unknown as Record<string, unknown>,
      };
    } catch (error: any) {
      console.error('Speedy API Error:', error?.response?.data || error?.message || error);
      throw new ShippingProviderException(
        'Failed to calculate shipping with Speedy',
        error?.response?.data || error?.message || {},
      );
    }
  }

  async createWaybill(
    request: CreateWaybillRequest,
  ): Promise<CreateWaybillResult> {
    try {
      const payload = this.buildBasePayload(request);

      if (request.senderInfo) {
        payload.sender = {
          dropoffOfficeId: payload.sender?.dropoffOfficeId,
          contactName: request.senderInfo.name,
          email: request.senderInfo.email,
          phone1: { number: request.senderInfo.phone },
        };
      }

      const response = await firstValueFrom(
        this.httpService.post<SpeedyShipmentResponse>(
          `${this.speedyUrl}/shipment`,
          payload,
        ),
      );

      const data = response.data;

      return {
        waybillNumber: data.id || data.shipmentId || '',
        price: data.price?.total || 0,
        rawDetails: data as unknown as Record<string, unknown>,
      };
    } catch (error: any) {
      console.error('Speedy API Error:', error?.response?.data || error?.message || error);
      throw new ShippingProviderException(
        'Failed to create waybill with Speedy',
        error?.response?.data || error?.message || {},
      );
    }
  }

  async getCities(countryCode?: string, search?: string): Promise<CityDto[]> {
    try {
      const response = await lastValueFrom(
        this.httpService.post<{ sites: SpeedyCityResponse[] }>(
          `${this.speedyUrl}/location/site`,
          {
            userName: this.userName,
            password: this.password,
            // Speedy използва countryId 100 за България. Може да се мапне динамично при нужда.
            countryId:
              countryCode === 'BGR' || !countryCode ? '100' : countryCode,
            name: search || '', // Use search parameter or empty string
            limit: 9999, // Fetch up to 9999 cities instead of default 10
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const sites = response.data.sites || [];

      // Унифициран мапинг
      return sites.map((site) => ({
        id: site.id,
        name: site.name,
        nameEn: site.nameEn,
        postCode: site.postCode,
        region: site.municipality || '',
      }));
    } catch (error: any) {
      console.error('Speedy API Error:', error?.response?.data || error?.message || error);
      throw new ShippingProviderException(
        'Failed to fetch cities from Speedy',
        error?.response?.data || error?.message || {},
      );
    }
  }

  async getOffices(cityId?: string | number): Promise<OfficeDto[]> {
    try {
      const payload: Record<string, any> = {
        userName: this.userName,
        password: this.password,
        countryId: '100',
        limit: 9999,
      };

      if (cityId) {
        payload.siteId = Number(cityId);
      }

      const response = await firstValueFrom(
        this.httpService.post<{ offices: SpeedyOfficeResponse[] }>(
          `${this.speedyUrl}/location/office`,
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );

      const offices = response.data.offices || [];

      return offices.map((office) => ({
        id: office.id,
        name: office.name,
        address:
          office.address?.fullAddressString ||
          office.address?.localAddressString ||
          '',
        cityId: office.siteId,
      }));
    } catch (error: any) {
      console.error('Speedy API Error:', error?.response?.data || error?.message || error);
      throw new ShippingProviderException(
        'Failed to fetch offices from Speedy',
        error?.response?.data || error?.message || {},
      );
    }
  }
}
