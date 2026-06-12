import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './repositories/orders.repository';
import { PlaceCashOrderUseCase } from './use-cases/place-cash-order.use-case';

import { StripeModule } from '../stripe/stripe.module';
import { ProductsModule } from '../products/products.module';
import { ConfirmStripeOrderUseCase } from './use-cases/confirm-stripe-order.use-case';
import { InitiateStripeOrderUseCase } from './use-cases/initiate-stripe-order.use-case';
import { CancelStripeOrderUseCase } from './use-cases/cancel-stripe-order.use-case';

@Module({
  imports: [ProductsModule, StripeModule],
  controllers: [OrdersController],
  providers: [
    OrdersRepository,
    PlaceCashOrderUseCase,
    InitiateStripeOrderUseCase,
    ConfirmStripeOrderUseCase,
    CancelStripeOrderUseCase,
  ],
  exports: [OrdersRepository],
})
export class OrdersModule {}

