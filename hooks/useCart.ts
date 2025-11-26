import { useSelector, useDispatch } from 'react-redux';
import {
  addItem,
  clearCart,
  selectCartItems,
  selectTotalPrice,
  selectItemCount,
  selectTotalItems,
  selectGroupedItems,
  updateItem,
  removeItem,
} from '@/app/store/features/cart/cartSlice';

import { RootState } from '@/app/store/store';
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
  updateAddresData,
  updateGuestData,
  deliveryCostFlag,
  selectDeliveryCostFlag,
} from '@/app/store/features/stripe/stripeSlice';
import { Metadata } from '@/app/api/payment-intent/route';

export const useCart = () => {
  const dispatch = useDispatch();

  return {
    //selectors
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
    deliveryCostFlag: useSelector(selectDeliveryCostFlag),

    //methods
    addItem: (product: any, personalisation: any) =>
      dispatch(addItem({ product, personalisation })),
    // addPaymentIntent: (intent: string) => dispatch(addPaymentIntent(intent)),
    updateItem: (productId: string | null, personalisation: any) =>
      dispatch(updateItem({ productId, personalisation })),

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
    updateAddresData: (state: AddressFormData | Partial<AddressFormData>) =>
      dispatch(updateAddresData(state as AddressFormData)),
    updateGuestData: (state: GuestFormData) => dispatch(updateGuestData(state)),
    setDeliveryCostFlag: (state: boolean) => dispatch(deliveryCostFlag(state)),
  };
};
