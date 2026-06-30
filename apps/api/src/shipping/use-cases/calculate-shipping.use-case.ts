import { Injectable } from '@nestjs/common';
import { ShippingEngineService } from '../services/shipping-engine.service';
import { CalculateShippingDto } from '../dto/calculate-shipping.dto';
import { ShippingCalculationResult } from '../domain/models';

@Injectable()
export class CalculateShippingUseCase {
  constructor(private readonly shippingEngine: ShippingEngineService) {}

  async execute(dto: CalculateShippingDto): Promise<ShippingCalculationResult> {
    // Delegates calculation to the underlying ShippingEngineService domain coordinator
    return this.shippingEngine.calculateShipping(dto);
  }
}
