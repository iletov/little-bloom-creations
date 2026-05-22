'use client';

import { useQuery } from '@tanstack/react-query';

const officesFetcher = async (siteId: string | undefined) => {
  const res = await fetch('/api/speedy-get-offices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ siteId }),
  });

  if (!res.ok) {
    throw new Error(`Speedy API getOffices error: ${res.status}`);
  }
  return res.json();
};

export function useOfficesSpeedy(
  siteId: string | undefined,
  enabled: boolean = true,
) {
  const { data, error, isLoading, isFetching } = useQuery<any[]>({
    queryKey: ['speedy-offices', siteId],
    queryFn: () => officesFetcher(siteId!),
    enabled: !!siteId && enabled,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  return {
    speedyOffices: data,
    isLoading,
    error,
    isFetching,
  };
}
