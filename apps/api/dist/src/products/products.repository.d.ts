import { BaseRepository } from '../database/base.repository';
import { Product } from '@repo/shared-types';
export declare class ProductsRepository extends BaseRepository {
    findAllActive(): Promise<Product[]>;
    findBySku(sku: string): Promise<Product | undefined>;
    decreaseStockSafely(sku: string, quantity: number): Promise<void>;
    decreaseStockSafelyById(productId: string, variantId: string | null, quantity: number): Promise<void>;
    upsertProduct(data: {
        sku: string;
        price: number;
        name: string;
        currentStock: number;
    }): Promise<Product>;
    upsertVariants(variants: {
        parentId: string;
        variantSku: string;
        variantName: string;
        currentStock: number;
        price: number;
        isActive: boolean;
    }[]): Promise<void>;
    deleteVariantsNotInList(parentId: string, variantSkusToKeep: string[]): Promise<void>;
    deleteProductBySku(sku: string): Promise<void>;
}
