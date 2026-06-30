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

import { apiConfig } from '@/lib/api/api-config';

const API_URL = apiConfig.baseUrl;

export const useCities = (
  courier: DeliveryMethodEnum | null,
  countryCode?: string,
  search?: string,
) => {
  return useQuery({
    queryKey: ['shipping', 'cities', courier, countryCode, search],
    queryFn: async (): Promise<CityDto[]> => {
      if (!courier) return [];

      const url = new URL(`${API_URL}/shipping/cities`);
      url.searchParams.append('courier', courier);
      if (countryCode) {
        url.searchParams.append('countryCode', countryCode);
      }
      if (search) {
        url.searchParams.append('search', search);
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
