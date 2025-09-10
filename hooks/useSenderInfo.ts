import { senderInfo } from '@/actions/ekont/senderDetails';
import useSWR from 'swr';

const fetcher = async () => {
  const data = await senderInfo();
  return data[0];
};

export const useSenderInfo = () => {
  const { data, isLoading, error } = useSWR('sender-info', fetcher);

  return {
    senderData: data,
    isLoading,
    isError: error,
  };
};

// import { senderInfo } from '@/actions/ekont/senderDetails';
// import useSWR from 'swr';

// const fetcher = async () => {
//   const data = await senderInfo();
//   return Array.isArray(data) && data.length > 0 ? data[0] : null;
// };

// export const useSenderInfo = () => {
//   // Add a timestamp to the key to force a fresh request every time
//   const timeStamp = Date.now();

//   const { data, isLoading, error } = useSWR(`sender-info`, fetcher, {
//     revalidateOnFocus: false, // Don't revalidate when window gets focus
//     revalidateOnReconnect: false, // Don't revalidate on reconnect
//     refreshInterval: 0, // Don't auto refresh
//     dedupingInterval: 0, // Don't dedupe requests
//     shouldRetryOnError: false, // Optional: whether to retry on errors
//   });

//   return {
//     senderData: data,
//     isLoading,
//     isError: error,
//   };
// };
