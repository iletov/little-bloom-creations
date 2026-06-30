import { Controller, Get, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { ShippingEngineService } from './services/shipping-engine.service';
import { CalculateShippingUseCase } from './use-cases/calculate-shipping.use-case';
import { ValidateAddressUseCase } from './use-cases/validate-address.use-case';
import { CreateWaybillUseCase } from './use-cases/create-waybill.use-case';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { ValidateAddressDto } from './dto/validate-address.dto';
import { CreateWaybillDto } from './dto/create-waybill.dto';
import { DeliveryMethodEnum } from '@repo/shared-types';

@Controller('shipping')
export class ShippingController {
  constructor(
    private readonly shippingEngine: ShippingEngineService,
    private readonly calculateShippingUseCase: CalculateShippingUseCase,
    private readonly validateAddressUseCase: ValidateAddressUseCase,
    private readonly createWaybillUseCase: CreateWaybillUseCase,
  ) {}

  @Get('cities')
  async getCities(
    @Query('courier') courier: DeliveryMethodEnum,
    @Query('countryCode') countryCode?: string,
    @Query('search') search?: string,
  ) {
    if (!courier) throw new BadRequestException('Courier is required');
    return this.shippingEngine.getCities(courier, countryCode, search);
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

  @Post('validate-address')
  async validateAddress(@Body() dto: ValidateAddressDto) {
    return this.validateAddressUseCase.execute(dto);
  }

  @Post('waybill')
  async createWaybill(@Body() dto: CreateWaybillDto) {
    return this.createWaybillUseCase.execute(dto);
  }
}

