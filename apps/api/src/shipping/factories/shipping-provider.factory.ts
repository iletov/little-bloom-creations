import { Injectable, BadRequestException } from '@nestjs/common';
import { IShippingProvider } from '../interfaces/shipping-provider.interface';
import { EcontShippingAdapter } from '../adapters/econt-shipping.adapter';
import { SpeedyShippingAdapter } from '../adapters/speedy-shipping.adapter';
import { DeliveryMethodEnum } from '@repo/shared-types';

@Injectable()
export class ShippingProviderFactory {
  constructor(
    private readonly econtAdapter: EcontShippingAdapter,
    private readonly speedyAdapter: SpeedyShippingAdapter,
  ) {}

  getProvider(deliveryMethod: DeliveryMethodEnum): IShippingProvider {
    switch (deliveryMethod) {
      case DeliveryMethodEnum.EKONT_OFFICE:
      case DeliveryMethodEnum.EKONT_DELIVERY:
        return this.econtAdapter;

      case DeliveryMethodEnum.SPEEDY_OFFICE:
      case DeliveryMethodEnum.SPEEDY_DELIVERY:
        return this.speedyAdapter;

      default:
        throw new BadRequestException(
          `Unsupported delivery method: ${deliveryMethod}`,
        );
    }
  }
}
