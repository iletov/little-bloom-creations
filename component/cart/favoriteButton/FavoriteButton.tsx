'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { motion } from 'motion/react';
import { motion } from 'framer-motion';
import { fetcher } from '@/lib/swr/fetcher';
import useSWR from 'swr';

interface FavoriteButtonProps {
  productId: string;
  productName?: string;
  // initialIsFavorite: string;
}

export default function FavoriteButton({
  productId,
  productName,
  // initialIsFavorite,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getlFaforites = async () => {
      try {
        const response = await fetch('/api/favorites', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setSelectedProductId(data.favorites);

        const isFavoriteProduct = data.favorites.includes(productId);
        setIsFavorite(isFavoriteProduct);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    getlFaforites();
  }, [productId]);

  const toggleFavorite = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      setIsFavorite(!isFavorite);
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, productName }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error('Failed to toggle favorite');
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
    // finally {
    //   setIsLoading(false);
    // }
    setIsLoading(false);
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className="min-w-[35px] min-h-[35px] flex items-center justify-center">
      <motion.div whileTap={{ scale: 0.6 }}>
        <Heart
          className={
            isFavorite
              ? 'text-mango fill-mango'
              : ' text-mango fill-neutral-200'
          }
          size={34}
        />
      </motion.div>
    </button>
  );
}
