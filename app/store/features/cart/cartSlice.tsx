import { EsotericaStore, MusicStore } from '@/sanity.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { calculateDiscountAmount } from '@/lib/discountamount';

type Product = MusicStore | EsotericaStore;
export type ProductWithSize = Product & {
  size?: string;
};
export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
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
    // addItem: (state, action: PayloadAction<MusicStore>) => {
    //   const newItem = action.payload;
    //   const existingItem = state.items.find(
    //     item => item.product._id === newItem._id,
    //   );

    //   if (existingItem) {
    //     state.items = state.items.map(item =>
    //       item.product._id === newItem._id
    //         ? { ...item, quantity: item.quantity + 1 }
    //         : item,
    //     );
    //   } else {
    //     state.items.push({ product: newItem, quantity: 1 });
    //   }

    addItem: (state, action: PayloadAction<ProductWithSize>) => {
      const newItem = action.payload;
      // Find existing item with same ID AND size
      const existingItem = state.items.find(
        item => item.product._id === newItem._id && item.size === newItem.size,
      );

      if (existingItem) {
        state.items = state.items.map(item =>
          item.product._id === newItem._id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // Extract size from the product and store it separately
        const { size, ...productWithoutSize } = newItem;
        state.items.push({
          product: productWithoutSize as Product,
          quantity: 1,
          size: size,
        });
      }
    },

    removeItem: (
      state,
      action: PayloadAction<{ productId: string; size?: string }>,
    ) => {
      const { productId, size } = action.payload;

      state.items = state.items.reduce((acc, item) => {
        if (item.product._id === productId && item.size === size) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
    },

    // removeItem: (state, action: PayloadAction<string>) => {
    //   state.items = state.items.reduce((acc, item) => {
    //     if (item.product._id === action.payload) {
    //       if (item.quantity > 1) {
    //         acc.push({ ...item, quantity: item.quantity - 1 });
    //       }
    //     } else {
    //       acc.push(item);
    //     }
    //     return acc;
    //   }, [] as CartItem[]);

    //   // if (typeof window !== 'undefined') {
    //   //   localStorage.setItem('cart', JSON.stringify(state));
    //   // }
    // },

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
  size?: string,
) => {
  const item = state.cart.items.find(
    item => item.product._id === productId && item.size === size,
  );
  return item ? item.quantity : 0;
};

export const selectTotalItems = (state: RootState, size?: string) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};

export const selectGroupedItems = (state: RootState) => state.cart.items;

// export const selectGroupedItems = (state: RootState) => {
//   return Object.values(
//     state.cart.items.reduce((groups: { [key: string]: CartItem }, item) => {
//       const id = item.product._id;
//       if (!groups[id]) {
//         groups[id] = item;
//       } else {
//         groups[id].quantity += item.quantity;
//       }
//       return groups;
//     }, {})
//   );
// };

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
