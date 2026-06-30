// store/middleware/localStorage.ts
import { Middleware, Action } from '@reduxjs/toolkit';

export const localStorageMiddleware: Middleware =
  store => next => (action: unknown) => {
    const result = next(action);

    if ((action as Action).type.startsWith('cart/')) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(store.getState().cart));
      }
    }

    // if ((action as Action).type.startsWith('payment/')) {
    //   if (typeof window !== 'undefined') {
    //     localStorage.setItem(
    //       'addressFormData',
    //       JSON.stringify(store.getState().payment),
    //     );
    //   }
    // }

    return result;
  };
