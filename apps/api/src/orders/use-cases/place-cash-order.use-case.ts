import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
  OrdersRepository,
  InsertOrderType,
  InsertOrderShippingType,
  InsertOrderItemType,
} from '../repositories/orders.repository';

import { PlaceCashOrderDto } from '../dto/place-cash-order.dto';
import { PlaceOrderResponse } from '../orders.controller';
import { ProductsRepository } from 'src/products/products.repository';
import { TransactionManager } from 'src/database/transaction.manager';
import { PaymentMethodEnum } from '@repo/shared-types';

@Injectable()
export class PlaceCashOrderUseCase {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly productsRepo: ProductsRepository,
  ) {}

  async execute(dto: PlaceCashOrderDto): Promise<PlaceOrderResponse> {
    // Отваряме транзакцията - от тук нататък всичко е защитено "Всичко или нищо"
    return TransactionManager.runInTransaction(async () => {
      const orderId = uuidv4();
      const orderNumber = `LBC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const subtotal = dto.totalAmount - dto.deliveryCost;

      // 1. Атомарно намаляване на наличностите
      for (const item of dto.items) {
        // Увери се, че DTO-то подава правилното SKU, по което търси репозиторито
        await this.productsRepo.decreaseStockSafely(item.sku, item.quantity);
      }

      // 2. Подготовка на данни за Базата (Строго camelCase според Drizzle)
      const orderData: InsertOrderType = {
        id: orderId,
        orderNumber,
        status: 'confirmed', // Или 'new' / 'pending_processing' според твоя enum
        totalAmount: dto.totalAmount.toString(),
        subtotal: subtotal.toString(),
        deliveryCost: dto.deliveryCost.toString(),
        deliveryMethod: dto.deliveryMethod,
        paymentMethod: PaymentMethodEnum.CASH,
        shipmentNumber: null, // Товарителницата ще се попълни по-късно от Админа
      };

      const shippingData: InsertOrderShippingType = {
        id: uuidv4(),
        orderId,
        fullName: `${dto.recipientInfo.firstName} ${dto.recipientInfo.lastName}`,
        email: dto.recipientInfo.email || '',
        phone: dto.recipientInfo.phone,
        country: dto.recipientAddress.country || 'BG',
        city: dto.recipientAddress.city,
        postalCode: dto.recipientAddress.postalCode || '',
        street: dto.recipientAddress.street || null,
        streetNumber: dto.recipientAddress.streetNumber || null,
        officeCode: dto.recipientInfo.officeId || null,
      };

      const itemsData: InsertOrderItemType[] = dto.items.map((item) => ({
        id: uuidv4(),
        orderId,
        // ВНИМАНИЕ: Спрямо схемата ти трябва productId. DTO-то трябва да го съдържа!
        productId: item.productId,
        variantId: item.variantId || null,
        name: item.name,
        variantName: item.variantName || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        subtotal: (item.unitPrice * item.quantity).toString(),
        weight: item.weight.toString(),
        personalization: item.personalization || null,
      }));

      // 3. Записваме в DB (Изпълнява се в транзакцията благодарение на BaseRepository)
      await this.ordersRepo.createFullOrder(orderData, shippingData, itemsData);

      // 4. Връщаме отговор СВЕТКАВИЧНО. Транзакцията се Commit-ва автоматично.
      return { orderNumber };
    });
  }
}
