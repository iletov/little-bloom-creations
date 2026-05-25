// src/shipping/shipping.controller.ts
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ShippingEngineService } from './services/shipping-engine.service';
import { DeliveryMethodEnum } from '@repo/shared-types';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingEngine: ShippingEngineService) {}

  @Get('cities')
  async getCities(
    @Query('courier') courier: DeliveryMethodEnum,
    @Query('countryCode') countryCode?: string,
  ) {
    if (!courier) throw new BadRequestException('Courier is required');
    return this.shippingEngine.getCities(courier, countryCode);
  }

  @Get('offices')
  async getOffices(
    @Query('courier') courier: DeliveryMethodEnum,
    @Query('cityId') cityId?: string,
  ) {
    if (!courier) throw new BadRequestException('Courier is required');
    return this.shippingEngine.getOffices(courier, cityId);
  }
}
