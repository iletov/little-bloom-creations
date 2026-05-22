'use server';

import { backendClient } from '@/sanity/lib/backendClient';

export type CartItem = {
  product: {
    _id: string;
  };
  quantity: number;
};

interface CheckQuantityProps {
  cartItems: CartItem[];
}

export const checkQuantity = async ({ cartItems }: CheckQuantityProps) => {
  const productIds = cartItems?.map((item: CartItem) => item.product._id);

  const products = await backendClient.fetch(
    `*[_type in ["musicStore", "esotericaStore"] && _id in $productIds]{
      _id,
      Name,
      stock
      }`,
    { productIds },
  );

  const stockErrors: {
    id: string;
    name: string;
    stock: number;
    requestedQuantity: number;
  }[] = [];

  for (const product of products) {
    const productId = product._id;
    // console.log('productId', productId);

    const cartItemsStock = cartItems?.find(
      (item: CartItem) => item?.product?._id === productId,
    );

    if (!cartItemsStock) continue;

    console.log(`Current Stock: ${product.stock}`);
    console.log(`Requested Quantity: ${cartItemsStock.quantity}`);

    // if (product?.stock < cartItemsStock?.quantity || product?.stock < 1) {
    if (product?.stock < cartItemsStock?.quantity) {
      console.log('The product is out of stock', productId);

      stockErrors.push({
        id: productId,
        name: product.Name,
        stock: product.stock,
        requestedQuantity: cartItemsStock.quantity,
      });
    }
  }
  console.log('stockErrors --- SERVER', stockErrors);

  return stockErrors.length > 0 ? stockErrors : null;
};
