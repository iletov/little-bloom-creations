import {
  selectDeliveryMethod,
  selectSenderDetails,
  setDeliveryMethod,
  setSenderDetails,
} from '@/app/store/features/ekont/senderSlice';
import { EkontSenderDetails } from '@/sanity.types';
import { useDispatch, useSelector } from 'react-redux';

export const useSenderDetails = () => {
  const dispatch = useDispatch();

  return {
    senderDetails: useSelector(selectSenderDetails),
    ekontMethod: useSelector(selectDeliveryMethod),
    setSenderDetails: (state: EkontSenderDetails) =>
      dispatch(setSenderDetails(state)),
    setEkontMethod: (state: string) => dispatch(setDeliveryMethod(state)),
  };
};
