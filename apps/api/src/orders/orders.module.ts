import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './repositories/orders.repository';
import { PlaceCashOrderUseCase } from './use-cases/place-cash-order.use-case';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersRepository, PlaceCashOrderUseCase],
  exports: [OrdersRepository],
})
export class OrdersModule {}
