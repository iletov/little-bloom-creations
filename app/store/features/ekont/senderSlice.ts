import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
// import { getEkontSenderDetails } from '@/sanity/lib/ekont/senderDetails';
import { RootState } from '../../store';

const ekontSenderSlice = createSlice({
  name: 'ekontSender',
  initialState: {
    senderDetails: [],
    deliveryMethod: '' as string,
    searchForCity: '' as any,
    selectedOffice: '' as any,
  },
  reducers: {
    setSenderDetails: (state, action: PayloadAction<any>) => {
      state.senderDetails = action.payload;
    },
    setDeliveryMethod: (state, action: PayloadAction<string>) => {
      state.deliveryMethod = action.payload;
    },
    setSearchForCity: (state, action: PayloadAction<any>) => {
      state.searchForCity = action.payload;
    },
    setSelectedOffice: (state, action: PayloadAction<any>) => {
      state.selectedOffice = action.payload;
    },
  },
});

export const selectSenderDetails = (state: RootState) =>
  state.ekontSender.senderDetails;
export const selectDeliveryMethod = (state: RootState) =>
  state.ekontSender.deliveryMethod;
export const selectSearchForCity = (state: RootState) =>
  state.ekontSender.searchForCity;
export const selectedOffice = (state: RootState) =>
  state.ekontSender.selectedOffice;

export const {
  setSenderDetails,
  setDeliveryMethod,
  setSearchForCity,
  setSelectedOffice,
} = ekontSenderSlice.actions;

export default ekontSenderSlice.reducer;
