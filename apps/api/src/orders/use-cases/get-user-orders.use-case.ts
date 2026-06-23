import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders.repository';

@Injectable()
export class GetUserOrdersUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute(email: string) {
    if (!email) {
      return [];
    }
    const orders = await this.ordersRepository.findOrdersByEmail(email);

    return orders.map(o => ({
      id: o.id,
      order_number: o.orderNumber,
      created_at: o.createdAt,
      status: o.status,
      total_amount: Number(o.totalAmount),
      subtotal: Number(o.subtotal),
      delivery_cost: Number(o.deliveryCost),
      delivery_method: o.deliveryMethod,
      payment_method: o.paymentMethod,
      shipment_number: o.shipmentNumber,
      order_shipping: o.shipping ? {
        id: o.shipping.id,
        full_name: o.shipping.fullName,
        email: o.shipping.email,
        phone: o.shipping.phone,
        country: o.shipping.country,
        city: o.shipping.city,
        postal_code: o.shipping.postalCode,
        street: o.shipping.street,
        street_number: o.shipping.streetNumber,
        office_code: o.shipping.officeCode,
        additional_info: o.shipping.additionalInfo,
      } : null,
      order_items: o.items?.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        unit_price: Number(i.unitPrice),
        subtotal: Number(i.subtotal),
        weight: i.weight,
        product_sku: i.productId,
        variant_name: i.variantName,
      }))
    }));
  }
}
