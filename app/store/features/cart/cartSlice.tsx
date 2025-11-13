// import { EsotericaStore, MusicStore } from '@/sanity.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { calculateDiscountAmount } from '@/lib/discountamount';

type Product = any;
export type ProductWithSize = Product & {
  size?: string;
};
export interface CartItem {
  product: Product;
  quantity: number;
  cartId: string;
  personalisation?: any;
}

interface CartState {
  items: CartItem[];
  // paymentIntent: string;
  // addItem: (product: Product) => void
  // removeItem: (productId: string) => void
  // clearCart: () => void
  // getTotalPrice: () => number
  // getItemCount: (productId: string) => number
  // getGroupedItems: () => CartItem[]
}

// const loadInitialState = () => {
//   if (typeof window !== 'undefined') {
//     const storedState = localStorage.getItem('cart');

//     return storedState ? JSON.parse(storedState) : { items: [] };
//   }

//   return {
//     items: [],
//     // paymentIntent: {},
//   };
// };
const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    try {
      // Get cart items
      const storedCart = localStorage.getItem('cart');
      const cartData = storedCart ? JSON.parse(storedCart) : { items: [] };

      // Get payment intent - expect just the string ID
      // const storedPaymentIntent = localStorage.getItem('getPaymentIntent');

      return {
        items: cartData.items || [],
        // paymentIntent: storedPaymentIntent || '', // Store just the string
      };
    } catch (error) {
      console.log('Error loading state:', error);
      return { items: [] };
    }
  }

  return {
    items: [],
    // paymentIntent: '',
  };
};

const initialState: CartState = loadInitialState();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ product: Product; personalisation: any }>,
    ) => {
      const { product, personalisation } = action.payload;

      state.items.push({
        cartId: crypto.randomUUID(),
        product: product as Product,
        personalisation: personalisation,
        quantity: 1,
      });
    },

    removeItem: (state, action: PayloadAction<string>) => {
      const cartItemId = action.payload;
      state.items = state.items.filter(item => item.cartId !== cartItemId);
    },

    clearCart: state => {
      state.items = [];
      // state.paymentIntent = '';
      // if (typeof window !== 'undefined') {
      //   localStorage.removeItem('cart');
      //   // localStorage.removeItem('getPaymentIntent');
      // }
    },
  },
});

// const calculateDiscountAmount = (product: {
//   price: number;
//   discount: number;
// }) => {
//   return product.price! - (product.price! * product.discount!) / 100;
// };

// const discountAmount =
// product.price! - (product?.price! * product?.discount!) / 100;

export const selectCartState = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectTotalPrice = (state: RootState) => {
  return state.cart.items.reduce(
    (acc, item) =>
      acc +
      calculateDiscountAmount({
        price: item?.product?.price ?? 0,
        discount: item?.product?.discount ?? 0,
      }) *
        item.quantity,
    0,
  );
};
// export const selectTotalPrice = (state: RootState) => {
//   return state.cart.items.reduce(
//     (acc, item) => acc + (item.product.price ?? 0) * item.quantity,
//     0,
//   );
// };

// export const selectPaymentIntent = (state: RootState) =>
//   state.cart.paymentIntent;

export const selectItemCount = (
  state: RootState,
  productId: string,
  // size?: string,
) => {
  const item = state.cart.items.find(item => item.product._id === productId);
  return item ? item.quantity : 0;
};

export const selectTotalItems = (state: RootState) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};

export const selectGroupedItems = (state: RootState) => state.cart.items;

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
