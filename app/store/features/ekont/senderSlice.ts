import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
// import { getEkontSenderDetails } from '@/sanity/lib/ekont/senderDetails';
import { RootState } from '../../store';

const ekontSenderSlice = createSlice({
  name: 'ekontSender',
  initialState: {
    senderDetails: [],
    deliveryMethod: '' as string,
  },
  reducers: {
    setSenderDetails: (state, action: PayloadAction<any>) => {
      state.senderDetails = action.payload;
    },
    setDeliveryMethod: (state, action: PayloadAction<string>) => {
      state.deliveryMethod = action.payload;
    },
  },
});

export const selectSenderDetails = (state: RootState) =>
  state.ekontSender.senderDetails;
export const selectDeliveryMethod = (state: RootState) =>
  state.ekontSender.deliveryMethod;
export const { setSenderDetails, setDeliveryMethod } = ekontSenderSlice.actions;

export default ekontSenderSlice.reducer;
