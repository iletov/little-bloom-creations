"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SyncSanityProductUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncSanityProductUseCase = void 0;
const common_1 = require("@nestjs/common");
const products_repository_1 = require("../../products/products.repository");
const transaction_manager_1 = require("../../database/transaction.manager");
let SyncSanityProductUseCase = SyncSanityProductUseCase_1 = class SyncSanityProductUseCase {
    productsRepository;
    logger = new common_1.Logger(SyncSanityProductUseCase_1.name);
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async execute(eventType, payload) {
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
        await transaction_manager_1.TransactionManager.runInTransaction(async () => {
            const product = await this.productsRepository.upsertProduct({
                sku,
                name,
                price: price || 0,
                currentStock: payload.stock || 0,
            });
            this.logger.log(`Upserted product: ${product.sku} (ID: ${product.id})`);
            const currentVariantSkus = [];
            if (payload.variants && payload.variants.length > 0) {
                const variantsToUpsert = payload.variants.map((v) => {
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
            await this.productsRepository.deleteVariantsNotInList(product.id, currentVariantSkus);
        });
        this.logger.log(`Successfully synced product ${sku} from Sanity`);
    }
};
exports.SyncSanityProductUseCase = SyncSanityProductUseCase;
exports.SyncSanityProductUseCase = SyncSanityProductUseCase = SyncSanityProductUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_repository_1.ProductsRepository])
], SyncSanityProductUseCase);
//# sourceMappingURL=sync-sanity-product.use-case.js.map