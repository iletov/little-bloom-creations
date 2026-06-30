import { Injectable } from '@nestjs/common';
import { ShippingEngineService } from '../services/shipping-engine.service';
import { ValidateAddressDto } from '../dto/validate-address.dto';

@Injectable()
export class ValidateAddressUseCase {
  constructor(private readonly shippingEngine: ShippingEngineService) {}

  async execute(dto: ValidateAddressDto): Promise<boolean | Record<string, unknown>> {
    return this.shippingEngine.validateAddress(
      dto.deliveryMethod,
      dto.address,
      dto.postalCode,
    );
  }
}
