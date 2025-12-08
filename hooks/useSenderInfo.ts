'use client';

import { useQuery } from '@tanstack/react-query';

const fetchSanity = async () => {
  const res = await fetch('/api/sanity-data');

  if (!res.ok) throw new Error('Failed to fetch data from API route');
  return res.json();
};

export function useSenderInfo() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['senderInfo'],
    queryFn: fetchSanity,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { senderData: data, isLoading, error };
}
