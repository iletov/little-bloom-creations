import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import paymentReducer from './features/stripe/stripeSlice';
import ekontSenderSlice from './features/ekont/senderSlice';
import { localStorageMiddleware } from './middleware/LocalStorage';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    payment: paymentReducer,
    ekontSender: ekontSenderSlice,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
