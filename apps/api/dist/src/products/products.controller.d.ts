import { GetAllActiveProductsUseCase } from './use-cases/get-all-active-products.use-case';
import { GetProductBySkuUseCase } from './use-cases/get-product-by-sku.use-case';
export declare class ProductsController {
    private readonly getAllActiveProductsUseCase;
    private readonly getProductBySkuUseCase;
    constructor(getAllActiveProductsUseCase: GetAllActiveProductsUseCase, getProductBySkuUseCase: GetProductBySkuUseCase);
    getAllActive(): Promise<{
        id: string;
        sku: string;
        name: string;
        price: number;
        discount: number;
        weight: number;
        width: number;
        height: number;
        length: number;
        depth: number;
        current_stock: number;
        is_active: boolean;
        variants?: {
            id: string;
            price: number;
            current_stock: number;
            is_active: boolean;
            variant_sku: string;
            parent_id: string;
            variant_name: string;
        }[] | undefined;
    }[]>;
    getBySku(sku: string): Promise<{
        id: string;
        sku: string;
        name: string;
        price: number;
        discount: number;
        weight: number;
        width: number;
        height: number;
        length: number;
        depth: number;
        current_stock: number;
        is_active: boolean;
        variants?: {
            id: string;
            price: number;
            current_stock: number;
            is_active: boolean;
            variant_sku: string;
            parent_id: string;
            variant_name: string;
        }[] | undefined;
    }>;
}
