declare const ProductDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    sku: import("zod").ZodString;
    name: import("zod").ZodString;
    price: import("zod").ZodNumber;
    discount: import("zod").ZodDefault<import("zod").ZodNumber>;
    weight: import("zod").ZodNumber;
    width: import("zod").ZodNumber;
    height: import("zod").ZodNumber;
    length: import("zod").ZodNumber;
    depth: import("zod").ZodNumber;
    current_stock: import("zod").ZodNumber;
    is_active: import("zod").ZodBoolean;
    variants: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
        id: import("zod").ZodString;
        variant_sku: import("zod").ZodString;
        parent_id: import("zod").ZodString;
        variant_name: import("zod").ZodString;
        price: import("zod").ZodNumber;
        current_stock: import("zod").ZodNumber;
        is_active: import("zod").ZodBoolean;
    }, "strip", import("zod").ZodTypeAny, {
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
}, "strip", import("zod").ZodTypeAny, {
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
}>, false>;
export declare class ProductDto extends ProductDto_base {
}
declare const ProductVariantDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    variant_sku: import("zod").ZodString;
    parent_id: import("zod").ZodString;
    variant_name: import("zod").ZodString;
    price: import("zod").ZodNumber;
    current_stock: import("zod").ZodNumber;
    is_active: import("zod").ZodBoolean;
}, "strip", import("zod").ZodTypeAny, {
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
}>, false>;
export declare class ProductVariantDto extends ProductVariantDto_base {
}
export {};
