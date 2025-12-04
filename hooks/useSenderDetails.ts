'use client';

import {
  selectDeliveryMethod,
  selectSearchForCity,
  selectSenderDetails,
  selectedOffice,
  setDeliveryMethod,
  setSearchForCity,
  setSenderDetails,
  setSelectedOffice,
} from '@/app/store/features/ekont/senderSlice';
import { EkontSenderDetails } from '@/sanity.types';
import { useDispatch, useSelector } from 'react-redux';

export const useSenderDetails = () => {
  const dispatch = useDispatch();

  return {
    senderDetails: useSelector(selectSenderDetails),
    ekontMethod: useSelector(selectDeliveryMethod),
    searchForCity: useSelector(selectSearchForCity),
    selectedOffice: useSelector(selectedOffice),

    setSenderDetails: (state: EkontSenderDetails) =>
      dispatch(setSenderDetails(state)),
    setEkontMethod: (state: string) => dispatch(setDeliveryMethod(state)),
    setSearchForCity: (state: any) => dispatch(setSearchForCity(state)),
    setSelectedOffice: (state: any) => dispatch(setSelectedOffice(state)),
  };
};
