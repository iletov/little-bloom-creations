import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './repositories/orders.repository';
import { PlaceCashOrderUseCase } from './use-cases/place-cash-order.use-case';

@Module({
  controllers: [OrdersController],
  providers: [OrdersRepository, PlaceCashOrderUseCase],
  exports: [OrdersRepository],
})
export class OrdersModule {}
