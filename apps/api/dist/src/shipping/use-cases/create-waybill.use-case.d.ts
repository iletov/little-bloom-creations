import { ShippingEngineService } from '../services/shipping-engine.service';
import { CreateWaybillDto } from '../dto/create-waybill.dto';
export declare class CreateWaybillUseCase {
    private readonly shippingEngine;
    constructor(shippingEngine: ShippingEngineService);
    execute(dto: CreateWaybillDto): Promise<import("../domain/models").CreateWaybillResult>;
}
