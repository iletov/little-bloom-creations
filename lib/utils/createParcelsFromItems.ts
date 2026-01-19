'use client';

import { parcelsType } from '@/actions/speedy/calculateLabelSpeedy';

interface CartItem {
  product?: {
    width?: number;
    height?: number;
    depth?: number;
    weight?: number;
  };
}

export const createParcelsFromItems = (
  items: CartItem[],
  orderNumber?: string,
): parcelsType[] => {
  return items.map((item, index) => ({
    seqNo: index + 1,
    size: {
      width: item?.product?.width ?? 10, // fallback default
      height: item?.product?.height ?? 10,
      depth: item?.product?.depth ?? 10,
    },
    weight: item?.product?.weight ?? 0.5, // fallback default
    ref1: `ORDER ${orderNumber?.slice(0, 8) ?? 'N/A'}, ${index + 1} Box`,
  }));
};
