import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EcontShippingAdapter } from './adapters/econt-shipping.adapter';
import { SpeedyShippingAdapter } from './adapters/speedy-shipping.adapter';
import { ShippingProviderFactory } from './factories/shipping-provider.factory';
import { ShippingEngineService } from './services/shipping-engine.service';
import { ShippingController } from './shipping.controller';
import { CalculateShippingUseCase } from './use-cases/calculate-shipping.use-case';

@Module({
  imports: [HttpModule],
  providers: [
    EcontShippingAdapter,
    SpeedyShippingAdapter,
    ShippingProviderFactory,
    ShippingEngineService,
    CalculateShippingUseCase,
  ],
  controllers: [ShippingController],
  exports: [ShippingEngineService],
})
export class ShippingModule {}
