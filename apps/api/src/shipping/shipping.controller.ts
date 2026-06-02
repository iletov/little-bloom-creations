import { Controller, Get, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { ShippingEngineService } from './services/shipping-engine.service';
import { CalculateShippingUseCase } from './use-cases/calculate-shipping.use-case';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { DeliveryMethodEnum } from '@repo/shared-types';

@Controller('shipping')
export class ShippingController {
  constructor(
    private readonly shippingEngine: ShippingEngineService,
    private readonly calculateShippingUseCase: CalculateShippingUseCase,
  ) {}

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

  @Post('calculate')
  async calculateShipping(@Body() dto: CalculateShippingDto) {
    return this.calculateShippingUseCase.execute(dto);
  }
}
