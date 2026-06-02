import { BadRequestException, Injectable } from '@nestjs/common';
import { and, eq, gte, sql } from 'drizzle-orm';
import { BaseRepository } from '../database/base.repository';
import { products, productVariants } from '../database/schema';
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

  async decreaseStockSafely(sku: string, quantity: number): Promise<void> {
    const result = await this.db
      .update(products)
      .set({
        currentStock: sql`${products.currentStock} - ${quantity}`,
      })
      .where(
        and(
          eq(products.sku, sku),
          gte(products.currentStock, quantity), // Ensures stock doesn't go negative
        ),
      )
      .returning({ updatedSku: products.sku });

    if (result.length === 0) {
      throw new BadRequestException(
        `Недостатъчна наличност или невалиден артикул за SKU: ${sku}`,
      );
    }
  }

  async decreaseStockSafelyById(
    productId: string,
    variantId: string | null,
    quantity: number,
    tx?: any,
  ): Promise<void> {
    const dbExecutor = tx || this.db;

    if (variantId) {
      const result = await dbExecutor
        .update(productVariants)
        .set({
          currentStock: sql`${productVariants.currentStock} - ${quantity}`,
        })
        .where(
          and(
            eq(productVariants.id, variantId),
            gte(productVariants.currentStock, quantity),
          ),
        )
        .returning({ updatedId: productVariants.id });

      if (result.length === 0) {
        throw new BadRequestException(
          `Недостатъчна наличност или невалиден вариант за ID: ${variantId}`,
        );
      }
    } else {
      const result = await dbExecutor
        .update(products)
        .set({
          currentStock: sql`${products.currentStock} - ${quantity}`,
        })
        .where(
          and(
            eq(products.id, productId),
            gte(products.currentStock, quantity),
          ),
        )
        .returning({ updatedId: products.id });

      if (result.length === 0) {
        throw new BadRequestException(
          `Недостатъчна наличност или невалиден продукт за ID: ${productId}`,
        );
      }
    }
  }
}
