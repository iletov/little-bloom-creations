import { ProductsRepository } from '../products.repository';
interface CartItem {
    sku: string;
    variantSku?: string;
    quantity: number;
}
export declare class CheckProductQuantityUseCase {
    private readonly productsRepo;
    constructor(productsRepo: ProductsRepository);
    execute(cartItems: CartItem[]): Promise<any>;
}
export {};
