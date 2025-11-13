'use client';
import { City } from '@/component/checkout/checkout-forms/CheckoutForm';
import { useQuery } from '@tanstack/react-query';

const citiesFetcher = async (url: string) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ countryCode: 'BGR' }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cities: ${response.status}`);
  }

  return response.json();
};

export function useCities() {
  const { data, error, isLoading, isFetching } = useQuery<City[]>({
    queryKey: ['cities', 'ekont'],
    queryFn: () => citiesFetcher('/api/ekont-get-cities'),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - data considered fresh
    gcTime: 24 * 60 * 60 * 1000, // 24 hours - cache retention time (formerly cacheTime)
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
    // refetchOnMount: false,
  });

  return {
    cities: data,
    isLoading,
    isError: error,
    isFetching,
  };
}
