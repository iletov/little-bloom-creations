import { Injectable } from '@nestjs/common';
import { ShippingEngineService } from '../services/shipping-engine.service';
import { CreateWaybillDto } from '../dto/create-waybill.dto';

@Injectable()
export class CreateWaybillUseCase {
  constructor(private readonly shippingEngine: ShippingEngineService) {}

  async execute(dto: CreateWaybillDto) {
    return this.shippingEngine.createWaybill(dto);
  }
}
