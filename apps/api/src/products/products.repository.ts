import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { BaseRepository } from '../database/base.repository';
import { products } from '../database/schema';
import { Product } from '@repo/shared-types';

@Injectable()
export class ProductsRepository extends BaseRepository {
  async findAllActive(): Promise<Product[]> {
    return this.db.query.products.findMany({
      where: eq(products.isActive, true),
      with: { variants: true },
    }) as unknown as Promise<Product[]>;
  }

  async findBySku(sku: string): Promise<Product | undefined> {
    const result = await this.db.query.products.findFirst({
      where: eq(products.sku, sku),
      with: { variants: true },
    });
    return result as unknown as Product | undefined;
  }
}
