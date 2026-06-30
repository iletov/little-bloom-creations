'use client';

export interface Item {
  product: {
    variant_sku: string;
    variant_name: string;
    name: string;
    variant_price: number;
    price: number;
    weight: number;
  };
}

export interface PackingListItem {
  inventoryNum: string;
  description: string;
  weight: number;
  price: number;
}

export const createPackingListFromItems = (
  items: Item[],
): PackingListItem[] => {
  return items.map((item: Item, index: number) => ({
    inventoryNum: ` ITEM 00${index + 1}`,
    description: item?.product?.variant_sku
      ? item?.product?.variant_name
      : item?.product?.name,
    weight: item?.product?.weight,
    price: Number(
      (item?.product?.variant_sku
        ? item?.product?.variant_price
        : item?.product?.price
      ).toFixed(2),
    ),
  }));
};
