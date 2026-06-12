import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EcontShippingAdapter } from './adapters/econt-shipping.adapter';
import { SpeedyShippingAdapter } from './adapters/speedy-shipping.adapter';
import { ShippingProviderFactory } from './factories/shipping-provider.factory';
import { ShippingEngineService } from './services/shipping-engine.service';
import { ShippingController } from './shipping.controller';
import { CalculateShippingUseCase } from './use-cases/calculate-shipping.use-case';
import { ValidateAddressUseCase } from './use-cases/validate-address.use-case';
import { CreateWaybillUseCase } from './use-cases/create-waybill.use-case';

@Module({
  imports: [HttpModule],
  providers: [
    EcontShippingAdapter,
    SpeedyShippingAdapter,
    ShippingProviderFactory,
    ShippingEngineService,
    CalculateShippingUseCase,
    ValidateAddressUseCase,
    CreateWaybillUseCase,
  ],
  controllers: [ShippingController],
  exports: [ShippingEngineService],
})
export class ShippingModule {}

