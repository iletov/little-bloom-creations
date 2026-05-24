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
};
exports.ProductsRepository = ProductsRepository;
exports.ProductsRepository = ProductsRepository = __decorate([
    (0, common_1.Injectable)()
], ProductsRepository);
//# sourceMappingURL=products.repository.js.map