import { BadRequestException, Injectable } from '@nestjs/common';
import { and, eq, gte, sql, getTableColumns } from 'drizzle-orm';
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

  async upsertProduct(
    data: {
      sku: string;
      price: number;
      name: string;
      currentStock: number;
    }
  ): Promise<Product> {
    const result = await this.db
      .insert(products)
      .values({
        sku: data.sku,
        name: data.name,
        price: data.price.toString(),
        currentStock: data.currentStock,
      })
      .onConflictDoUpdate({
        target: products.sku,
        set: {
          ...Object.keys(data).reduce((acc, key) => {
            if (['id', 'createdAt', 'currentStock'].includes(key)) return acc;

            const colName =
              getTableColumns(products)[key as keyof typeof products.$inferSelect]
                ?.name;
            if (!colName) return acc;

            return {
              ...acc,
              [colName]: sql.raw(`excluded.${colName}`),
            };
          }, {}),
        },
      })
      .returning();

    return result[0] as unknown as Product;
  }

  async upsertVariants(
    variants: {
      parentId: string;
      variantSku: string;
      variantName: string;
      currentStock: number;
      price: number;
      isActive: boolean;
    }[]
  ): Promise<void> {
    if (variants.length === 0) return;

    const variantsToInsert = variants.map(v => ({
      ...v,
      price: v.price.toString(),
    }));

    await this.db
      .insert(productVariants)
      .values(variantsToInsert)
      .onConflictDoUpdate({
        target: productVariants.variantSku,
        set: {
          ...Object.keys(variants[0]).reduce((acc, key) => {
            if (['id', 'createdAt', 'currentStock'].includes(key)) return acc;

            const colName =
              getTableColumns(productVariants)[
                key as keyof typeof productVariants.$inferSelect
              ]?.name;
            if (!colName) return acc;

            return {
              ...acc,
              [colName]: sql.raw(`excluded.${colName}`),
            };
          }, {}),
        },
      });
  }

  async deleteVariantsNotInList(parentId: string, variantSkusToKeep: string[]): Promise<void> {
    // First get existing variants for this parent
    const existingVariants = await this.db.query.productVariants.findMany({
      where: eq(productVariants.parentId, parentId),
      columns: { variantSku: true }
    });
    
    const existingSkus = existingVariants.map(v => v.variantSku);
    const skusToDelete = existingSkus.filter(sku => !variantSkusToKeep.includes(sku));
    
    if (skusToDelete.length > 0) {
      // Delete one by one to avoid dynamic IN clause issues or use inArray if imported
      for (const sku of skusToDelete) {
        await this.db.delete(productVariants).where(eq(productVariants.variantSku, sku));
      }
    }
  }

  async deleteProductBySku(sku: string): Promise<void> {
    await this.db.delete(products).where(eq(products.sku, sku));
  }
}
