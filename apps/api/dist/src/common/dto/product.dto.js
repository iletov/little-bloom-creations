"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantDto = exports.ProductDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const shared_types_1 = require("@repo/shared-types");
class ProductDto extends (0, nestjs_zod_1.createZodDto)(shared_types_1.ProductSchema) {
}
exports.ProductDto = ProductDto;
class ProductVariantDto extends (0, nestjs_zod_1.createZodDto)(shared_types_1.ProductVariantSchema) {
}
exports.ProductVariantDto = ProductVariantDto;
//# sourceMappingURL=product.dto.js.map