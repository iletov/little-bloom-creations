import { ShippingEngineService } from '../services/shipping-engine.service';
import { ValidateAddressDto } from '../dto/validate-address.dto';
export declare class ValidateAddressUseCase {
    private readonly shippingEngine;
    constructor(shippingEngine: ShippingEngineService);
    execute(dto: ValidateAddressDto): Promise<boolean | Record<string, unknown>>;
}
