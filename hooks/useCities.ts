import { City } from '@/component/checkout/checkout-forms/CheckoutForm';
import useSWR from 'swr';

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
  // Use SWR to fetch and cache the data
  const { data, error, isLoading, isValidating } = useSWR<City[]>(
    '/api/ekont-get-cities',
    citiesFetcher,
    {
      // Cache configuration for static data
      revalidateOnFocus: false, // Don't refetch when window regains focus
      revalidateIfStale: false, // Don't automatically revalidate stale data
      revalidateOnReconnect: false, // Don't revalidate on reconnect
      dedupingInterval: 86400000, // Cache for 24 hours (in milliseconds)
    },
  );

  return {
    cities: data,
    isLoading,
    isError: error,
    isValidating,
  };
}
