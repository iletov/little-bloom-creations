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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const get_all_active_products_use_case_1 = require("./use-cases/get-all-active-products.use-case");
const get_product_by_sku_use_case_1 = require("./use-cases/get-product-by-sku.use-case");
const check_product_quantity_use_case_1 = require("./use-cases/check-product-quantity.use-case");
let ProductsController = class ProductsController {
    getAllActiveProductsUseCase;
    getProductBySkuUseCase;
    checkProductQuantityUseCase;
    constructor(getAllActiveProductsUseCase, getProductBySkuUseCase, checkProductQuantityUseCase) {
        this.getAllActiveProductsUseCase = getAllActiveProductsUseCase;
        this.getProductBySkuUseCase = getProductBySkuUseCase;
        this.checkProductQuantityUseCase = checkProductQuantityUseCase;
    }
    async getAllActive() {
        return this.getAllActiveProductsUseCase.execute();
    }
    async checkQuantity(data) {
        return this.checkProductQuantityUseCase.execute(data.cartItems);
    }
    async getBySku(sku) {
        return this.getProductBySkuUseCase.execute(sku);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAllActive", null);
__decorate([
    (0, common_1.Post)('check-quantity'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "checkQuantity", null);
__decorate([
    (0, common_1.Get)(':sku'),
    __param(0, (0, common_1.Param)('sku')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getBySku", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [get_all_active_products_use_case_1.GetAllActiveProductsUseCase,
        get_product_by_sku_use_case_1.GetProductBySkuUseCase,
        check_product_quantity_use_case_1.CheckProductQuantityUseCase])
], ProductsController);
//# sourceMappingURL=products.controller.js.map