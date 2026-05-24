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
} from '../domain/models';
import { ShippingProviderException } from '../domain/exceptions';
import {
  SpeedyPayload,
  SpeedyCalculateResponse,
  SpeedyShipmentResponse,
} from './types/speedy.types';
import { DeliveryMethodEnum, PaymentMethodEnum } from '@repo/shared-types';

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
    } catch (error: unknown) {
      throw new ShippingProviderException(
        'Failed to validate address with Speedy',
        error,
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
        streetId: request.recipientAddress.streetId,
        streetNo: request.recipientAddress.streetNumber,
        blockNo: request.recipientAddress.blockNo,
        entranceNo: request.recipientAddress.entranceNo,
        floorNo: request.recipientAddress.floorNo,
        apartmentNo: request.recipientAddress.apartmentNo,
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
    };
  }

  async calculateShipping(
    request: ShippingCalculationRequest,
  ): Promise<ShippingCalculationResult> {
    try {
      const payload = this.buildBasePayload(request);

      // Perfectly safe - sender is typed explicitly as optional in SpeedyPayload
      payload.sender = { clientId: 9999999998000 };

      const response = await firstValueFrom(
        this.httpService.post<SpeedyCalculateResponse>(
          `${this.speedyUrl}/calculate`,
          payload,
        ),
      );

      const calculations = response.data?.calculations;
      if (!calculations || calculations.length === 0) {
        throw new Error('No calculations returned from Speedy');
      }

      return {
        price: calculations[0].price.total,
        rawDetails: calculations[0] as unknown as Record<string, unknown>,
      };
    } catch (error: unknown) {
      throw new ShippingProviderException(
        'Failed to calculate shipping with Speedy',
        error,
      );
    }
  }

  async createWaybill(
    request: CreateWaybillRequest,
  ): Promise<CreateWaybillResult> {
    try {
      const payload = this.buildBasePayload(request);

      payload.sender = {
        clientId: '9999999998000',
        contactName: request.senderInfo.name,
        email: request.senderInfo.email,
        phone1: { number: request.senderInfo.phone },
      };

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
    } catch (error: unknown) {
      throw new ShippingProviderException(
        'Failed to create waybill with Speedy',
        error,
      );
    }
  }
}
