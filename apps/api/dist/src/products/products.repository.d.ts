import { BaseRepository } from '../database/base.repository';
import { Product } from '@repo/shared-types';
export declare class ProductsRepository extends BaseRepository {
    findAllActive(): Promise<Product[]>;
    findBySku(sku: string): Promise<Product | undefined>;
    decreaseStockSafely(sku: string, quantity: number): Promise<void>;
}
