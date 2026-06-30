import { ProductsRepository } from '../../products/products.repository';
export interface SanityWebhookPayload {
    _type: string;
    sku: string;
    name: string;
    price?: number;
    stock?: number;
    operation?: string;
    _deleted?: boolean;
    variants?: {
        sku: string;
        name: string;
        stock?: number;
        price?: number;
        inStock?: boolean;
    }[];
}
export declare class SyncSanityProductUseCase {
    private readonly productsRepository;
    private readonly logger;
    constructor(productsRepository: ProductsRepository);
    execute(eventType: string, payload: SanityWebhookPayload): Promise<void>;
}
