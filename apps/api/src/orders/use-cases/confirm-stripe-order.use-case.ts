import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders.repository';
import { ProductsRepository } from '../../products/products.repository';
import { StripeService } from '../../stripe/stripe.service';
import { TransactionManager } from '../../database/transaction.manager';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unknown error';

@Injectable()
export class ConfirmStripeOrderUseCase {
  private readonly logger = new Logger(ConfirmStripeOrderUseCase.name);

  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly productsRepo: ProductsRepository,
    private readonly stripeService: StripeService,
  ) {}




  async execute(orderId: string, paymentIntentId: string) {
    try {
      await TransactionManager.runInTransaction(async () => {
        // 1. Извличане на поръчката и нейните артикули
        const order = await this.ordersRepo.findById(orderId);
        if (!order) {
          throw new BadRequestException(`Order with id ${orderId} not found`);
        }

        if (['confirmed', 'cancelled', 'failed', 'refunded'].includes(order.status)) {
          this.logger.warn(`Order ${orderId} is already ${order.status}, skipping fulfillment`);
          return;
        }

        // 2. Опитваме да намалим наличностите
        for (const item of order.items) {
          await this.productsRepo.decreaseStockSafelyById(
            item.productId,
            item.variantId,
            item.quantity,
          );
        }

        // 3. Ако няма грешки (има наличност), изтегляме парите
        await this.stripeService.capturePayment(paymentIntentId);

        // 4. Сменяме статуса на поръчката на 'confirmed'
        await this.ordersRepo.updateStatus(orderId, 'confirmed');
        await this.ordersRepo.savePaymentIntent(orderId, paymentIntentId);
      });
    } catch (error: unknown) {
      this.logger.error(`Failed to confirm order ${orderId}:`, getErrorMessage(error));

      // В случай на грешка (напр. липса на наличност или грешка при capture),
      // отменяме оторизираното плащане
      try {
        await this.stripeService.cancelPayment(paymentIntentId);
        this.logger.log(`Payment intent ${paymentIntentId} was cancelled due to stock availability or other error.`);
      } catch (cancelError: unknown) {
        this.logger.error(
          `Failed to cancel Stripe payment ${paymentIntentId} for order ${orderId}:`,
          getErrorMessage(cancelError),
        );
      }

      // Ъпдейтваме статуса на поръчката на cancelled извън транзакцията,
      // за да се запази дори след rollback-а на първоначалната транзакция
      try {
        await this.ordersRepo.updateStatus(orderId, 'cancelled');
      } catch (statusError: unknown) {
        this.logger.error(
          `Failed to update order ${orderId} status to cancelled:`,
          getErrorMessage(statusError),
        );
      }

      throw new InternalServerErrorException('Error confirming Stripe order. Payment cancelled.');
    }
  }
}
