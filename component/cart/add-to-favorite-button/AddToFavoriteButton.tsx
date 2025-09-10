'use client';

import { toggleFavorite } from '@/actions/togleFavorite';
// import { toggleFavorite } from '@/actions/togleFavorite';
import { setLoading } from '@/app/store/features/stripe/stripeSlice';
import { Loader } from '@/component/loader/Loader';
import { EsotericaStore, MusicStore } from '@/sanity.types';
import { backendClient } from '@/sanity/lib/backendClient';
import { getFavoriteProducts } from '@/sanity/lib/favorites/getFavoriteProducts';
import { useAuth } from '@clerk/nextjs';
import { StarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type FavoriteProps = {
  product: MusicStore | EsotericaStore;
};

export const AddToFavoriteButton = ({ product }: FavoriteProps) => {
  const { userId } = useAuth();
  // const [favorites, setFavorites] = useState<string[]>([]);
  const [favorites, setFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const result = await backendClient.fetch(
          `*[_type == "favoriteProducts" && userId == $userId][0].itemId[]._ref`,
          { userId },
        );
        setFavorites(result?.includes(product._id) || false);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    if (userId) {
      checkFavoriteStatus();
    }
  }, [product._id]);

  const handleFavorite = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const isAddedToFavorites = await toggleFavorite(product._id);

      setFavorites(!!isAddedToFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full text-right">
      <button className={`p-2`} onClick={handleFavorite} disabled={isLoading}>
        <StarIcon
          className={`w-6 h-6 ${isLoading ? 'opacity-30' : ''}`}
          color="#65a30d"
          fill={favorites ? '#65a30d' : 'none'}
        />
      </button>
    </div>
  );
};
