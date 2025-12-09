'use client';

import { useQuery } from '@tanstack/react-query';

const fetchSanityEkont = async () => {
  const res = await fetch('/api/sanity-data');

  if (!res.ok) throw new Error('Failed to fetch data from API route');
  return res.json();
};

const fetchSanitySpeedy = async () => {
  const res = await fetch('/api/sanity-data-speedy');

  if (!res.ok) throw new Error('Failed to fetch data from API route');
  return res.json();
};

export function useSenderInfo(enabled: boolean = true) {
  const ekontQuery = useQuery({
    queryKey: ['senderInfo', 'ekont'],
    queryFn: fetchSanityEkont,
    enabled,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const speedyQuery = useQuery({
    queryKey: ['senderInfo', 'speedy'],
    queryFn: fetchSanitySpeedy,
    enabled,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    senderData: ekontQuery.data,
    senderDataSpeedy: speedyQuery.data,
    isLoading: ekontQuery.isLoading || speedyQuery.isLoading,
    error: ekontQuery.error || speedyQuery.error,
  };
}
