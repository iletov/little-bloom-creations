import { BaseRepository } from '../../database/base.repository';
import { Order } from '@repo/shared-types';
export declare class OrdersRepository extends BaseRepository {
    createOrder(orderData: Partial<Order>, items: any[], shipping: any): Promise<Order>;
    findById(id: string): Promise<Order | undefined>;
    findByOrderNumber(orderNumber: string): Promise<Order | undefined>;
}
