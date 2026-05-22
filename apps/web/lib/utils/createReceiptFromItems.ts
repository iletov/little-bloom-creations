'use client';

interface CartItem {
  product: {
    name: string;
    price: number;
    variant_sku: string;
    variant_name: string;
    variant_price: number;
    quantity: number;
  };
}

export interface ReceiptItem {
  description: string;
  vatGroup: string;
  amount: number;
  amountWithVat: number;
}

export const createReceiptFromItems = (items: CartItem[]): ReceiptItem[] => {
  return items?.map(item => ({
    description: item?.product?.variant_sku
      ? item?.product?.variant_name
      : item?.product?.name,
    vatGroup: 'Б',
    amount: Number(
      (item?.product?.variant_sku
        ? item?.product?.variant_price / 1.2
        : item?.product?.price / 1.2
      ).toFixed(2),
    ),
    amountWithVat: Number(
      (item?.product?.variant_sku
        ? item?.product?.variant_price
        : item?.product?.price
      ).toFixed(2),
    ),
  }));
};
