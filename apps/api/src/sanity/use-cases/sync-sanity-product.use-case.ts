import { Injectable, Logger } from '@nestjs/common';
import { ProductsRepository } from '../../products/products.repository';
import { TransactionManager } from '../../database/transaction.manager';

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

@Injectable()
export class SyncSanityProductUseCase {
  private readonly logger = new Logger(SyncSanityProductUseCase.name);

  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(eventType: string, payload: SanityWebhookPayload): Promise<void> {
    if (payload._type !== 'productType') {
      this.logger.warn(`Ignored webhook for type: ${payload._type}`);
      return;
    }

    const { sku, name, price } = payload;

    if (eventType === 'delete') {
      await this.productsRepository.deleteProductBySku(sku);
      this.logger.log(`Deleted product: ${sku}`);
      return;
    }

    // Insert or update (upsert)
    await TransactionManager.runInTransaction(async () => {
      // 1. Upsert product
      const product = await this.productsRepository.upsertProduct(
        {
          sku,
          name,
          price: price || 0,
          currentStock: payload.stock || 0,
        }
      );

      this.logger.log(`Upserted product: ${product.sku} (ID: ${product.id})`);

      const currentVariantSkus: string[] = [];

      // 2. Upsert variants
      if (payload.variants && payload.variants.length > 0) {
        const variantsToUpsert = payload.variants.map((v: any) => {
          currentVariantSkus.push(v.sku);
          return {
            parentId: product.id,
            variantSku: v.sku,
            variantName: v.name,
            currentStock: v.stock || 0,
            price: v.price || 0,
            isActive: v.inStock !== false,
          };
        });

        await this.productsRepository.upsertVariants(variantsToUpsert);
        this.logger.log(`Upserted ${variantsToUpsert.length} variants for product ${product.sku}`);
      }

      // 3. Delete variants that were removed in Sanity
      await this.productsRepository.deleteVariantsNotInList(product.id, currentVariantSkus);
    });

    this.logger.log(`Successfully synced product ${sku} from Sanity`);
  }
}
