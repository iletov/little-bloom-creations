"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRepository = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const base_repository_1 = require("../database/base.repository");
const schema_1 = require("../database/schema");
let ProductsRepository = class ProductsRepository extends base_repository_1.BaseRepository {
    async findAllActive() {
        return this.db.query.products.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.products.isActive, true),
            with: { variants: true },
        });
    }
    async findBySku(sku) {
        const result = await this.db.query.products.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.products.sku, sku),
            with: { variants: true },
        });
        return result;
    }
    async decreaseStockSafely(sku, quantity) {
        const result = await this.db
            .update(schema_1.products)
            .set({
            currentStock: (0, drizzle_orm_1.sql) `${schema_1.products.currentStock} - ${quantity}`,
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.products.sku, sku), (0, drizzle_orm_1.gte)(schema_1.products.currentStock, quantity)))
            .returning({ updatedSku: schema_1.products.sku });
        if (result.length === 0) {
            throw new common_1.BadRequestException(`Недостатъчна наличност или невалиден артикул за SKU: ${sku}`);
        }
    }
    async decreaseStockSafelyById(productId, variantId, quantity, tx) {
        const dbExecutor = tx || this.db;
        if (variantId) {
            const result = await dbExecutor
                .update(schema_1.productVariants)
                .set({
                currentStock: (0, drizzle_orm_1.sql) `${schema_1.productVariants.currentStock} - ${quantity}`,
            })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.productVariants.id, variantId), (0, drizzle_orm_1.gte)(schema_1.productVariants.currentStock, quantity)))
                .returning({ updatedId: schema_1.productVariants.id });
            if (result.length === 0) {
                throw new common_1.BadRequestException(`Недостатъчна наличност или невалиден вариант за ID: ${variantId}`);
            }
        }
        else {
            const result = await dbExecutor
                .update(schema_1.products)
                .set({
                currentStock: (0, drizzle_orm_1.sql) `${schema_1.products.currentStock} - ${quantity}`,
            })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.products.id, productId), (0, drizzle_orm_1.gte)(schema_1.products.currentStock, quantity)))
                .returning({ updatedId: schema_1.products.id });
            if (result.length === 0) {
                throw new common_1.BadRequestException(`Недостатъчна наличност или невалиден продукт за ID: ${productId}`);
            }
        }
    }
    async upsertProduct(data) {
        const result = await this.db
            .insert(schema_1.products)
            .values({
            sku: data.sku,
            name: data.name,
            price: data.price.toString(),
            currentStock: data.currentStock,
        })
            .onConflictDoUpdate({
            target: schema_1.products.sku,
            set: {
                ...Object.keys(data).reduce((acc, key) => {
                    if (['id', 'createdAt', 'currentStock'].includes(key))
                        return acc;
                    const colName = (0, drizzle_orm_1.getTableColumns)(schema_1.products)[key]
                        ?.name;
                    if (!colName)
                        return acc;
                    return {
                        ...acc,
                        [colName]: drizzle_orm_1.sql.raw(`excluded.${colName}`),
                    };
                }, {}),
            },
        })
            .returning();
        return result[0];
    }
    async upsertVariants(variants) {
        if (variants.length === 0)
            return;
        const variantsToInsert = variants.map(v => ({
            ...v,
            price: v.price.toString(),
        }));
        await this.db
            .insert(schema_1.productVariants)
            .values(variantsToInsert)
            .onConflictDoUpdate({
            target: schema_1.productVariants.variantSku,
            set: {
                ...Object.keys(variants[0]).reduce((acc, key) => {
                    if (['id', 'createdAt', 'currentStock'].includes(key))
                        return acc;
                    const colName = (0, drizzle_orm_1.getTableColumns)(schema_1.productVariants)[key]?.name;
                    if (!colName)
                        return acc;
                    return {
                        ...acc,
                        [colName]: drizzle_orm_1.sql.raw(`excluded.${colName}`),
                    };
                }, {}),
            },
        });
    }
    async deleteVariantsNotInList(parentId, variantSkusToKeep) {
        const existingVariants = await this.db.query.productVariants.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.productVariants.parentId, parentId),
            columns: { variantSku: true }
        });
        const existingSkus = existingVariants.map(v => v.variantSku);
        const skusToDelete = existingSkus.filter(sku => !variantSkusToKeep.includes(sku));
        if (skusToDelete.length > 0) {
            for (const sku of skusToDelete) {
                await this.db.delete(schema_1.productVariants).where((0, drizzle_orm_1.eq)(schema_1.productVariants.variantSku, sku));
            }
        }
    }
    async deleteProductBySku(sku) {
        await this.db.delete(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.sku, sku));
    }
};
exports.ProductsRepository = ProductsRepository;
exports.ProductsRepository = ProductsRepository = __decorate([
    (0, common_1.Injectable)()
], ProductsRepository);
//# sourceMappingURL=products.repository.js.map