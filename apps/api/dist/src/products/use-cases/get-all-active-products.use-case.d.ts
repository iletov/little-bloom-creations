import { ProductsRepository } from '../products.repository';
import { Product } from '@repo/shared-types';
export declare class GetAllActiveProductsUseCase {
    private readonly productsRepository;
    constructor(productsRepository: ProductsRepository);
    execute(): Promise<Product[]>;
}
