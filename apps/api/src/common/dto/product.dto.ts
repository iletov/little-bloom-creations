import { createZodDto } from 'nestjs-zod';
import { ProductSchema, ProductVariantSchema } from '@repo/shared-types';

export class ProductDto extends createZodDto(ProductSchema) {}
export class ProductVariantDto extends createZodDto(ProductVariantSchema) {}
