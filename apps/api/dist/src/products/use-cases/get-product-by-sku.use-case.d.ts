import { ProductsRepository } from '../products.repository';
import { Product } from '@repo/shared-types';
export declare class GetProductBySkuUseCase {
    private readonly productsRepository;
    constructor(productsRepository: ProductsRepository);
    execute(sku: string): Promise<Product>;
}
