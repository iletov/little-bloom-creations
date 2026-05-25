import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrdersRepository } from './repositories/orders.repository';

// Тук можеш да импортираш и ProductsRepository, ако имаш логика за намаляване на бройките

@Injectable()
export class ConfirmStripeOrderUseCase {
  constructor(private readonly ordersRepo: OrdersRepository) {}

  async execute(orderId: string, paymentIntentId: string) {
    try {
      // 1. Сменяме статуса на поръчката от 'pending' на 'confirmed'
      await this.ordersRepo.updateStatus(orderId, 'confirmed');

      // 2. За всеки случай обновяваме Stripe ID-то (ако не е записано при инициализацията)
      await this.ordersRepo.savePaymentIntent(orderId, paymentIntentId);

      // В БЪДЕЩЕ ТУК: Намаляване на стоката от склада (inventory)
    } catch (error) {
      console.error(`Failed to confirm order ${orderId}:`, error);
      throw new InternalServerErrorException('Error confirming Stripe order');
    }
  }
}
