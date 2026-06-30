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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckProductQuantityUseCase = void 0;
const common_1 = require("@nestjs/common");
const products_repository_1 = require("../products.repository");
let CheckProductQuantityUseCase = class CheckProductQuantityUseCase {
    productsRepo;
    constructor(productsRepo) {
        this.productsRepo = productsRepo;
    }
    async execute(cartItems) {
        const stockErrors = [];
        for (const item of cartItems) {
            const product = await this.productsRepo.findBySku(item.sku);
            if (!product) {
                throw new common_1.BadRequestException(`Product with SKU ${item.sku} not found`);
            }
            if (item.variantSku) {
                const variant = product.variants?.find(v => v.variant_sku === item.variantSku);
                if (!variant) {
                    throw new common_1.BadRequestException(`Variant ${item.variantSku} for product ${item.sku} not found`);
                }
                if (variant.current_stock < item.quantity) {
                    stockErrors.push({
                        sku: item.sku,
                        variantSku: item.variantSku,
                        name: `${product.name} - ${variant.variant_name}`,
                        stock: variant.current_stock,
                        requestedQuantity: item.quantity,
                    });
                }
            }
            else {
                if (product.current_stock < item.quantity) {
                    stockErrors.push({
                        sku: item.sku,
                        name: product.name,
                        stock: product.current_stock,
                        requestedQuantity: item.quantity,
                    });
                }
            }
        }
        return stockErrors.length > 0 ? stockErrors : null;
    }
};
exports.CheckProductQuantityUseCase = CheckProductQuantityUseCase;
exports.CheckProductQuantityUseCase = CheckProductQuantityUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_repository_1.ProductsRepository])
], CheckProductQuantityUseCase);
//# sourceMappingURL=check-product-quantity.use-case.js.map