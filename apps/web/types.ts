import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from './sanity.types';

export type OrderShipping = {
  id: string;
  city?: string;
  email?: string;
  phone?: string;
  street?: string;
  country?: string;
  block_no?: string;
  floor_no?: string;
  order_id?: string;
  full_name?: string;
  created_at?: string;
  entrance_no?: string;
  office_code?: string;
  postal_code?: string;
  apartment_no?: string;
  street_number?: string;
  additional_info?: string;
};

export type OrderItems = {
  id: string;
  name: string;
  weight: string;
  quantity: number;
  subtotal: number;
  created_at: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  unit_price: number;
  product_sku: string;
  variant_sku?: string;
  variant_name?: string;
  personalization?: any;
};

// types/order.ts
export interface Order {
  order_number: string;
  created_at: string;
  status: string;
  total_amount?: number;
  subtotal?: number;
  delivery_cost?: number;
  delivery_method: string;
  delivery_company?: string;
  payment_method: string;
  email?: string | undefined;
  full_name?: string | undefined;
  shipment_number?: string;
  order_shipping?: OrderShipping;
  order_items?: OrderItems[];
}

export type descriptionType = {
  description?: Array<
    | {
        children?: Array<{
          marks?: Array<string>;
          text?: string;
          _type: 'span';
          _key: string;
        }>;
        style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';
        listItem?: 'bullet';
        markDefs?: Array<{
          href?: string;
          _type: 'link';
          _key: string;
        }>;
        level?: number;
        _type: 'block';
        _key: string;
      }
    | {
        asset?: {
          _ref: string;
          _type: 'reference';
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: 'sanity.imageAsset';
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        alt?: string;
        _type: 'image';
        _key: string;
      }
  >;
};

export type ImagesType = {
  asset?: {
    _ref: string;
    _type: 'reference';
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: 'sanity.imageAsset';
  };
  hotspot?: SanityImageHotspot;
  title?: string;
  alt?: string;
  slug?: {
    current: string;
  };
  crop?: SanityImageCrop;
  _type: 'image';
  _key: string;
};

export type ListItems = {
  _key: string;
  title: string;
  subTitle?: string;
  description: string;
  image?: ImagesType;
  button?: {
    text: string;
    slug: {
      current: string;
    };
  };
};

export type Title = {
  title: string;
  highlightedWord?: string;
  highlightedColor?: string;
};
