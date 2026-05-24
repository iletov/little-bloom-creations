import { Controller, Post, Body } from '@nestjs/common';
import { PlaceCashOrderUseCase } from './use-cases/place-cash-order.use-case';
import { PlaceCashOrderDto } from './dto/place-cash-order.dto';

export interface PlaceOrderResponse {
  orderNumber: string;
  waybillNumber: string;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly placeCashOrderUseCase: PlaceCashOrderUseCase) {}

  @Post('cash')
  async placeCashOrder(
    @Body() dto: PlaceCashOrderDto,
  ): Promise<PlaceOrderResponse> {
    return this.placeCashOrderUseCase.execute(dto);
  }
}
