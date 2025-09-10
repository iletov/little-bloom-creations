export const calculateDiscountAmount = (product: {
  price: number;
  discount: number;
}) => {
  return product.price! - (product.price! * product.discount!) / 100;
};
