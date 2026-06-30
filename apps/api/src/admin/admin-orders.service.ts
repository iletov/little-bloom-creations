import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { orders } from '../database/schema';
import { OrderStatus } from '@repo/shared-types';

@Injectable()
export class AdminOrdersService {
  constructor(private readonly adminRepository: AdminRepository) {}
  private transformOrder(order: typeof orders.$inferSelect & { shipping?: Record<string, unknown> | null, items?: Record<string, unknown>[] }) {
    return {
      ...order,
      delivery_method:
        order.deliveryMethod?.includes('office') ||
        order.deliveryMethod?.includes('pickup')
          ? 'office'
          : 'delivery',
      delivery_company: order.deliveryMethod?.startsWith('ekont')
        ? 'ekont'
        : 'speedy',
    };
  }

  async getAllOrders() {
    
    const allOrdersData = await this.adminRepository.getAllOrdersWithBasicShipping();

    // Transform mapping properties and extracting what frontend expects
    const mappedOrders = allOrdersData.map(o => {
      const transformed = this.transformOrder(o);
      // Map to snake_case equivalent or specific structure if frontend requires it
      return {
        ...transformed,
        order_number: o.orderNumber,
        created_at: o.createdAt,
        status: o.status,
        delivery_method: transformed.delivery_method,
        payment_method: o.paymentMethod,
        delivery_cost: Number(o.deliveryCost),
        total_amount: Number(o.totalAmount),
        subtotal: Number(o.subtotal),
        shipment_number: o.shipmentNumber,
        order_shipping: o.shipping ? {
          full_name: (o.shipping as Record<string, unknown>).fullName,
          email: (o.shipping as Record<string, unknown>).email,
        } : null,
      };
    });

    const recentOrders = mappedOrders.slice(0, 10);

    return {
      allOrders: mappedOrders,
      recentOrders,
    };
  }

  async getSingleOrder(orderNumber: string) {

    const orderData = await this.adminRepository.getOrderByNumber(orderNumber);

    if (!orderData) {
      throw new NotFoundException(`Order ${orderNumber} not found`);
    }

    const transformed = this.transformOrder(orderData);

    // Deep map to snake_case for frontend
    return {
      ...transformed,
      order_number: orderData.orderNumber,
      created_at: orderData.createdAt,
      status: orderData.status,
      delivery_method: transformed.delivery_method,
      payment_method: orderData.paymentMethod,
      delivery_cost: Number(orderData.deliveryCost),
      total_amount: Number(orderData.totalAmount),
      subtotal: Number(orderData.subtotal),
      shipment_number: orderData.shipmentNumber,
      order_shipping: orderData.shipping ? {
        full_name: orderData.shipping.fullName,
        email: orderData.shipping.email,
        phone: orderData.shipping.phone,
        country: orderData.shipping.country,
        city: orderData.shipping.city,
        postal_code: orderData.shipping.postalCode,
        street: orderData.shipping.street,
        street_number: orderData.shipping.streetNumber,
        office_code: orderData.shipping.officeCode,
        additional_info: orderData.shipping.additionalInfo,
      } : null,
      order_items: orderData.items?.map(i => ({
        id: i.id,
        name: i.name,
        product_sku: (i as any).product?.sku || 'N/A',
        variant_name: i.variantName,
        quantity: i.quantity,
        unit_price: Number(i.unitPrice),
        subtotal: Number(i.subtotal),
        weight: Number(i.weight) || Number((i as any).product?.weight) || 0,
        personalization: i.personalization,
        dimensions: {
          width: Number((i as any).product?.width) || 0,
          height: Number((i as any).product?.height) || 0,
          depth: Number((i as any).product?.depth) || 0,
        }
      }))
    };
  }

  async updateOrder(orderId: string, updates: Partial<typeof orders.$inferInsert>) {
    
    // Convert camelCase or snake_case as needed by schema. 
    // Drizzle schema uses camelCase properties for DB columns.
    const dbUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (key === 'status') dbUpdates.status = value;
      // You can map other fields here if needed
    }

    if (Object.keys(dbUpdates).length === 0) {
      // fallback to passing all updates directly if no specific mapping was done
      Object.assign(dbUpdates, updates);
    }

    return this.adminRepository.updateOrder(orderId, dbUpdates);
  }

  async markAsDelivered(orderId: string) {
    const orderData = await this.adminRepository.getOrderByNumber(orderId);
    if (!orderData) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }
    if (orderData.status === 'cancelled') {
      throw new Error('Cannot mark a cancelled order as delivered.');
    }
    await this.adminRepository.updateOrder(orderId, { status: 'delivered' });
    return { success: true, status: 'delivered' };
  }
}
