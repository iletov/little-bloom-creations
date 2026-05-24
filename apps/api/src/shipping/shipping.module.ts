import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EcontShippingAdapter } from './adapters/econt-shipping.adapter';
import { SpeedyShippingAdapter } from './adapters/speedy-shipping.adapter';
import { ShippingProviderFactory } from './factories/shipping-provider.factory';

@Module({
  imports: [HttpModule],
  providers: [
    EcontShippingAdapter,
    SpeedyShippingAdapter,
    ShippingProviderFactory,
  ],
  exports: [ShippingProviderFactory],
})
export class ShippingModule {}
