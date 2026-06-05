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
) => {
  return items.map((item, index) => ({
    seqNo: index + 1,
    width: Number(item?.product?.width ?? 10),
    height: Number(item?.product?.height ?? 10),
    depth: Number(item?.product?.depth ?? 10),
    weight: Number(item?.product?.weight ?? 0.5),
    ref1: `ORDER ${orderNumber?.slice(0, 8) ?? 'N/A'}, ${index + 1} Box`,
  }));
};
