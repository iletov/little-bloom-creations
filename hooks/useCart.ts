import { useSelector, useDispatch } from 'react-redux';
import {
  addItem,
  clearCart,
  selectCartItems,
  selectTotalPrice,
  selectItemCount,
  selectTotalItems,
  selectGroupedItems,
  ProductWithSize,
  removeItem,
} from '@/app/store/features/cart/cartSlice';

import { RootState } from '@/app/store/store';
import { selectProducts, setAllProducts } from '@/app/store/features/root';
import {
  clearClientSecret,
  selectClientSecret,
  selectPaymentIntentId,
  selectError,
  selectLoading,
  selectMetadata,
  setClientSecret,
  setError,
  setLoading,
  setMetadata,
  setPaymentIntentId,
  selectGuestFormData,
  selectAddressFormData,
  saveGuestData,
  saveAddressData,
  clearFormData,
  GuestFormData,
  AddressFormData,
  selectDeliveryCost,
  setDeliveryCost,
} from '@/app/store/features/stripe/stripeSlice';
import { Metadata } from '@/app/api/payment-intent/route';

export const useCart = () => {
  const dispatch = useDispatch();

  return {
    //selectors
    allProducts: useSelector(selectProducts),
    items: useSelector(selectCartItems),
    paymentIntentId: useSelector(selectPaymentIntentId),
    totalPrice: useSelector(selectTotalPrice),
    totalItems: useSelector(selectTotalItems),
    groupedItems: useSelector(selectGroupedItems),
    clientSecret: useSelector(selectClientSecret),
    loadingState: useSelector(selectLoading),
    errorState: useSelector(selectError),
    metadata: useSelector(selectMetadata),
    guestFormData: useSelector(selectGuestFormData),
    addressFormData: useSelector(selectAddressFormData),
    deliveryCost: useSelector(selectDeliveryCost),

    //methods
    addProducts: (products: any) => dispatch(setAllProducts(products)),
    addItem: (product: any) => dispatch(addItem(product)),
    // addPaymentIntent: (intent: string) => dispatch(addPaymentIntent(intent)),
    removeItem: (product: string) => dispatch(removeItem(product)),
    clearCart: () => dispatch(clearCart()),
    getItemCount: (productId: string, size?: string) =>
      useSelector((state: RootState) => selectItemCount(state, productId)),

    dispatchClientSecret: (state: string) => dispatch(setClientSecret(state)),
    dispatchPaymentIntentId: (state: string | null) =>
      dispatch(setPaymentIntentId(state)),
    dispatchtLoadingPaymentState: (state: boolean) =>
      dispatch(setLoading(state)),
    dispatchErrorPaymentState: (state: string) => dispatch(setError(state)),
    setMetadata: (state: Metadata) => dispatch(setMetadata(state)),
    clearClientSecret: () => dispatch(clearClientSecret()),
    saveGuestData: (state: GuestFormData) => dispatch(saveGuestData(state)),
    saveAddressData: (state: AddressFormData) =>
      dispatch(saveAddressData(state)),
    setDeliveryCost: (state: number) => dispatch(setDeliveryCost(state)),
    clearFormData: () => dispatch(clearFormData()),
  };
};
