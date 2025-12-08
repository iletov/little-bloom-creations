'use client';

import { Office } from '@/component/checkout/dropdown-results/OfficeDropdown';
import { useQuery } from '@tanstack/react-query';

const officesFetcher = async (
  countryCode: string | undefined,
  cityId: string | undefined,
) => {
  // console.log('Fetching offices for:', { countryCode, cityId });
  // if (!countryCode || !cityId) return;

  const res = await fetch('/api/ekont-get-offices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ countryCode, cityId }),
  });

  if (!res.ok) {
    throw new Error(`Econt API getOffices error: ${res.status}`);
  }
  return res.json();
};

export function useOffices(
  countryCode: string | undefined,
  cityId: string | undefined,
  enabled: boolean = true,
) {
  const { data, error, isLoading, isFetching } = useQuery<Office[]>({
    queryKey: ['offices', countryCode, cityId],
    queryFn: () => officesFetcher(countryCode!, cityId!),
    enabled: !!countryCode && !!cityId && enabled,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
    // refetchOnMount: false,
  });

  return {
    offices: data,
    isLoading,
    error,
    isFetching,
  };
}
