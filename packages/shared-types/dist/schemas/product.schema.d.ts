import { z } from 'zod';
export declare const ProductVariantSchema: z.ZodObject<{
    id: z.ZodString;
    variant_sku: z.ZodString;
    parent_id: z.ZodString;
    variant_name: z.ZodString;
    price: z.ZodNumber;
    current_stock: z.ZodNumber;
    is_active: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    variant_sku: string;
    parent_id: string;
    variant_name: string;
    price: number;
    current_stock: number;
    is_active: boolean;
}, {
    id: string;
    variant_sku: string;
    parent_id: string;
    variant_name: string;
    price: number;
    current_stock: number;
    is_active: boolean;
}>;
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodString;
    sku: z.ZodString;
    name: z.ZodString;
    price: z.ZodNumber;
    discount: z.ZodDefault<z.ZodNumber>;
    weight: z.ZodNumber;
    width: z.ZodNumber;
    height: z.ZodNumber;
    length: z.ZodNumber;
    depth: z.ZodNumber;
    current_stock: z.ZodNumber;
    is_active: z.ZodBoolean;
    variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        variant_sku: z.ZodString;
        parent_id: z.ZodString;
        variant_name: z.ZodString;
        price: z.ZodNumber;
        current_stock: z.ZodNumber;
        is_active: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        variant_sku: string;
        parent_id: string;
        variant_name: string;
        price: number;
        current_stock: number;
        is_active: boolean;
    }, {
        id: string;
        variant_sku: string;
        parent_id: string;
        variant_name: string;
        price: number;
        current_stock: number;
        is_active: boolean;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    length: number;
    id: string;
    price: number;
    current_stock: number;
    is_active: boolean;
    sku: string;
    name: string;
    discount: number;
    weight: number;
    width: number;
    height: number;
    depth: number;
    variants?: {
        id: string;
        variant_sku: string;
        parent_id: string;
        variant_name: string;
        price: number;
        current_stock: number;
        is_active: boolean;
    }[] | undefined;
}, {
    length: number;
    id: string;
    price: number;
    current_stock: number;
    is_active: boolean;
    sku: string;
    name: string;
    weight: number;
    width: number;
    height: number;
    depth: number;
    discount?: number | undefined;
    variants?: {
        id: string;
        variant_sku: string;
        parent_id: string;
        variant_name: string;
        price: number;
        current_stock: number;
        is_active: boolean;
    }[] | undefined;
}>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
