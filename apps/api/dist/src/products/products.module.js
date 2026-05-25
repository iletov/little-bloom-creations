"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const products_controller_1 = require("./products.controller");
const products_repository_1 = require("./products.repository");
const get_all_active_products_use_case_1 = require("./use-cases/get-all-active-products.use-case");
const get_product_by_sku_use_case_1 = require("./use-cases/get-product-by-sku.use-case");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        controllers: [products_controller_1.ProductsController],
        providers: [
            products_repository_1.ProductsRepository,
            get_all_active_products_use_case_1.GetAllActiveProductsUseCase,
            get_product_by_sku_use_case_1.GetProductBySkuUseCase,
        ],
        exports: [
            get_all_active_products_use_case_1.GetAllActiveProductsUseCase,
            get_product_by_sku_use_case_1.GetProductBySkuUseCase,
            products_repository_1.ProductsRepository,
        ],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map