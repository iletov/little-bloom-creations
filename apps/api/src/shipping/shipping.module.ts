import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EcontShippingAdapter } from './adapters/econt-shipping.adapter';
import { SpeedyShippingAdapter } from './adapters/speedy-shipping.adapter';
import { ShippingProviderFactory } from './factories/shipping-provider.factory';
import { ShippingEngineService } from './services/shipping-engine.service';
import { ShippingController } from './ahipping.controller';

@Module({
  imports: [HttpModule],
  providers: [
    EcontShippingAdapter,
    SpeedyShippingAdapter,
    ShippingProviderFactory,
    ShippingEngineService,
  ],
  controllers: [ShippingController],
  exports: [ShippingEngineService],
})
export class ShippingModule {}
