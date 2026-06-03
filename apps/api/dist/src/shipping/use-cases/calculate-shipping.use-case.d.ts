import { ShippingEngineService } from '../services/shipping-engine.service';
import { CalculateShippingDto } from '../dto/calculate-shipping.dto';
import { ShippingCalculationResult } from '../domain/models';
export declare class CalculateShippingUseCase {
    private readonly shippingEngine;
    constructor(shippingEngine: ShippingEngineService);
    execute(dto: CalculateShippingDto): Promise<ShippingCalculationResult>;
}
