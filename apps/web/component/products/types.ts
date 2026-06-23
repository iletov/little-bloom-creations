import { Slug } from '@/sanity.types';
import { descriptionType, ImagesType } from '@/types';

export interface Variant {
  id: string;
  sku?: string;
  parent_sku?: string;
  product_id?: string;
  variant_sku?: string;
  variant_name?: string;
  variant_type?: string;
  current_stock?: number;
  price_adjustment?: number;
  price?: number;
  is_active?: boolean;
  images?: ImagesType[];
  color?: string;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
}

export interface PersonalizationOptions {
  nameAddonPrice?: number;
  embroideryAddonPrice?: number;
  embroideryImages?: { alt?: string; asset?: any; [key: string]: any }[];
}

export interface Product {
  id: string;
  slug: Slug;
  category?: { slug?: { current: string } };
  sku: string;
  name: string;
  price: number;
  description?: descriptionType | string;
  images: ImagesType[];
  variants?: Variant[];
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  color?: string;
  personalizationOptions?: PersonalizationOptions;
}
