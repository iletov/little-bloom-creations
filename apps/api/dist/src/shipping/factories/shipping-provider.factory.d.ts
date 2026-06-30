import { IShippingProvider } from '../interfaces/shipping-provider.interface';
import { EcontShippingAdapter } from '../adapters/econt-shipping.adapter';
import { SpeedyShippingAdapter } from '../adapters/speedy-shipping.adapter';
import { DeliveryMethodEnum } from '@repo/shared-types';
export declare class ShippingProviderFactory {
    private readonly econtAdapter;
    private readonly speedyAdapter;
    constructor(econtAdapter: EcontShippingAdapter, speedyAdapter: SpeedyShippingAdapter);
    getProvider(deliveryMethod: DeliveryMethodEnum): IShippingProvider;
}
