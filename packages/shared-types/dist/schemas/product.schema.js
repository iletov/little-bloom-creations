"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = exports.ProductVariantSchema = void 0;
const zod_1 = require("zod");
exports.ProductVariantSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    variant_sku: zod_1.z.string().min(1),
    parent_id: zod_1.z.string().uuid(),
    variant_name: zod_1.z.string(),
    price: zod_1.z.number().positive(),
    current_stock: zod_1.z.number().int().nonnegative(),
    is_active: zod_1.z.boolean(),
});
exports.ProductSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    sku: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    price: zod_1.z.number().positive(),
    discount: zod_1.z.number().min(0).max(100).default(0),
    weight: zod_1.z.number().positive(),
    width: zod_1.z.number().positive(),
    height: zod_1.z.number().positive(),
    length: zod_1.z.number().positive(),
    depth: zod_1.z.number().positive(),
    current_stock: zod_1.z.number().int().nonnegative(),
    is_active: zod_1.z.boolean(),
    variants: zod_1.z.array(exports.ProductVariantSchema).optional(),
});
