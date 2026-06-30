import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders.repository';

@Injectable()
export class GetOrderStatusUseCase {
  constructor(private readonly ordersRepo: OrdersRepository) {}

  async execute(orderNumber: string) {
    const order = await this.ordersRepo.findByOrderNumber(orderNumber);

    if (!order) {
      throw new NotFoundException(`Order with number ${orderNumber} not found`);
    }

    // Map the database order status to the frontend's expected status strings
    let mappedStatus = 'pending';
    let message = 'Processing your order. Please wait...';

    if (order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered') {
      mappedStatus = 'success';
      message = order.status === 'delivered' ? 'Order delivered successfully!' : 'Order created successfully!';
    } else if (order.status === 'cancelled') {
      mappedStatus = 'failed';
      message = 'Order creation failed or was cancelled.';
    } else if (order.status === 'refunded') {
      mappedStatus = 'refunded';
      message = 'Payment refunded.';
    }

    return {
      status: mappedStatus,
      order: {
        id: order.id,
        total_amount: order.totalAmount,
        created_at: order.createdAt,
        order_number: order.orderNumber,
        payment_method: order.paymentMethod,
      },
      order_number: order.orderNumber,
      message,
    };
  }
}
