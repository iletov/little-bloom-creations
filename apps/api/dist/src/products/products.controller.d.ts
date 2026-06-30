import { GetAllActiveProductsUseCase } from './use-cases/get-all-active-products.use-case';
import { GetProductBySkuUseCase } from './use-cases/get-product-by-sku.use-case';
import { CheckProductQuantityUseCase } from './use-cases/check-product-quantity.use-case';
export declare class ProductsController {
    private readonly getAllActiveProductsUseCase;
    private readonly getProductBySkuUseCase;
    private readonly checkProductQuantityUseCase;
    constructor(getAllActiveProductsUseCase: GetAllActiveProductsUseCase, getProductBySkuUseCase: GetProductBySkuUseCase, checkProductQuantityUseCase: CheckProductQuantityUseCase);
    getAllActive(): Promise<{
        length: number;
        id: string;
        price: number;
        current_stock: number;
        is_active: boolean;
        sku: string;
        name: string;
        discount: number;
        weight: number;
        width: number;
        height: number;
        depth: number;
        variants?: {
            id: string;
            variant_sku: string;
            parent_id: string;
            variant_name: string;
            price: number;
            current_stock: number;
            is_active: boolean;
        }[] | undefined;
    }[]>;
    checkQuantity(data: {
        cartItems: {
            sku: string;
            quantity: number;
            variantSku?: string;
        }[];
    }): Promise<any>;
    getBySku(sku: string): Promise<{
        length: number;
        id: string;
        price: number;
        current_stock: number;
        is_active: boolean;
        sku: string;
        name: string;
        discount: number;
        weight: number;
        width: number;
        height: number;
        depth: number;
        variants?: {
            id: string;
            variant_sku: string;
            parent_id: string;
            variant_name: string;
            price: number;
            current_stock: number;
            is_active: boolean;
        }[] | undefined;
    }>;
}
