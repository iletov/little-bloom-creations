import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Metadata } from '@/app/api/payment-intent/route';

export interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface AddressFormData {
  country: string;
  city: string;
  street?: string;
  streetNumber?: string;
  other?: string;
  postalCode: string;
  phoneNumber: string;
  officeCode?: string;
}

interface PaymentState {
  clientSecret: string | null;
  paymentIntentId: string | null;
  loading: boolean;
  error: string | null;
  metadata: Metadata;
  guestFormData: GuestFormData | null;
  addressFormData: AddressFormData | null;
  deliveryCost: number;
}

const initialState: PaymentState = {
  clientSecret: null,
  paymentIntentId: null,
  loading: false,
  error: null,
  metadata: {
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    clerkUserId: '',
  },
  guestFormData: null,
  addressFormData: null,
  deliveryCost: 0,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setClientSecret: (state, action: PayloadAction<string | null>) => {
      state.clientSecret = action.payload;
    },
    setPaymentIntentId: (state, action: PayloadAction<string | null>) => {
      state.paymentIntentId = action.payload;
    },
    clearClientSecret: state => {
      state.clientSecret = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMetadata: (state, action: PayloadAction<Metadata>) => {
      state.metadata = action.payload;
    },
    saveGuestData: (state, action: PayloadAction<GuestFormData>) => {
      state.guestFormData = action.payload;
    },
    saveAddressData: (state, action: PayloadAction<AddressFormData>) => {
      state.addressFormData = action.payload;
    },
    setDeliveryCost: (state, action: PayloadAction<number>) => {
      state.deliveryCost = action.payload;
    },
    clearFormData: state => {
      state.guestFormData = null;
      state.addressFormData = null;
    },
  },
});

export const selectClientSecret = (state: RootState) =>
  state.payment.clientSecret;
export const selectPaymentIntentId = (state: RootState) =>
  state.payment.paymentIntentId;
export const selectLoading = (state: RootState) => state.payment.loading;
export const selectError = (state: RootState) => state.payment.error;
export const selectMetadata = (state: RootState) => state.payment.metadata;
export const selectGuestFormData = (state: RootState) =>
  state.payment.guestFormData;
export const selectAddressFormData = (state: RootState) =>
  state.payment.addressFormData;
export const selectDeliveryCost = (state: RootState) =>
  state.payment.deliveryCost;

export const {
  setClientSecret,
  setPaymentIntentId,
  setLoading,
  setError,
  setMetadata,
  clearClientSecret,
  saveGuestData,
  saveAddressData,
  setDeliveryCost,
  clearFormData,
} = paymentSlice.actions;
export default paymentSlice.reducer;
