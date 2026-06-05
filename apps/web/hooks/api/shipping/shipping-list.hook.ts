import { useQuery } from '@tanstack/react-query';
import { DeliveryMethodEnum } from '@repo/shared-types';

export interface CityDto {
  id: number | string;
  name: string;
  nameEn?: string;
  postCode: string;
  region?: string;
  countryCode?: string;
}

export interface OfficeDto {
  id: number | string;
  name: string;
  address: string;
  cityId?: number | string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useCities = (
  courier: DeliveryMethodEnum | null,
  countryCode?: string,
) => {
  return useQuery({
    queryKey: ['shipping', 'cities', courier, countryCode],
    queryFn: async (): Promise<CityDto[]> => {
      if (!courier) return [];

      const url = new URL(`${API_URL}/shipping/cities`);
      url.searchParams.append('courier', courier);
      if (countryCode) {
        url.searchParams.append('countryCode', countryCode);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }

      return response.json();
    },
    enabled: !!courier,
    staleTime: Infinity,
  });
};

export const useOffices = (
  courier: DeliveryMethodEnum | null,
  cityId?: string | number,
) => {
  return useQuery({
    queryKey: ['shipping', 'offices', courier, cityId],
    queryFn: async (): Promise<OfficeDto[]> => {
      if (!courier) return [];

      const url = new URL(`${API_URL}/shipping/offices`);
      url.searchParams.append('courier', courier);
      if (cityId) {
        url.searchParams.append('cityId', cityId.toString());
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch offices');
      }

      return response.json();
    },
    enabled: !!courier,
    staleTime: Infinity,
  });
};
