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
  selectedCity,
  setSelecetedCity,
  validationStreet,
  setValidationStreet,
} from '@/app/store/features/ekont/senderSlice';
import { EkontSenderDetails, SenderDetails } from '@/sanity.types';
import { useDispatch, useSelector } from 'react-redux';

export const useSenderDetails = () => {
  const dispatch = useDispatch();

  return {
    senderDetails: useSelector(selectSenderDetails),
    deliveryMethod: useSelector(selectDeliveryMethod),
    searchForCity: useSelector(selectSearchForCity),
    selectedOffice: useSelector(selectedOffice),
    selectedCity: useSelector(selectedCity),
    validationStreet: useSelector(validationStreet),

    setSenderDetails: (state: SenderDetails) =>
      dispatch(setSenderDetails(state)),
    setDeliveryMethod: (state: string) => dispatch(setDeliveryMethod(state)),
    setSearchForCity: (state: any) => dispatch(setSearchForCity(state)),
    setSelectedOffice: (state: any) => dispatch(setSelectedOffice(state)),
    setSelectedCity: (state: any) => dispatch(setSelecetedCity(state)),
    setValidationStreet: (state: any) => dispatch(setValidationStreet(state)),
  };
};
