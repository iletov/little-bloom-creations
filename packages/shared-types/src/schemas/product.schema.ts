import { z } from 'zod';

export const ProductVariantSchema = z.object({
  id: z.string().uuid(),
  variant_sku: z.string().min(1),
  parent_id: z.string().uuid(),
  variant_name: z.string(),
  price: z.number().positive(),
  current_stock: z.number().int().nonnegative(),
  is_active: z.boolean(),
});

export const ProductSchema = z.object({
  id: z.string().uuid(),
  sku: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  discount: z.number().min(0).max(100).default(0),
  weight: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  length: z.number().positive(),
  depth: z.number().positive(),
  current_stock: z.number().int().nonnegative(),
  is_active: z.boolean(),
  variants: z.array(ProductVariantSchema).optional(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
