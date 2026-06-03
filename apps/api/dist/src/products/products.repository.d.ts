import { BaseRepository } from '../database/base.repository';
import { Product } from '@repo/shared-types';
export declare class ProductsRepository extends BaseRepository {
    findAllActive(): Promise<Product[]>;
    findBySku(sku: string): Promise<Product | undefined>;
    decreaseStockSafely(sku: string, quantity: number): Promise<void>;
    decreaseStockSafelyById(productId: string, variantId: string | null, quantity: number, tx?: any): Promise<void>;
}
