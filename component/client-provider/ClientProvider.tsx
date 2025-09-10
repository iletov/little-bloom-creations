'use client';
import { useCart } from '@/hooks/useCart';
import { useProductState } from '@/hooks/useProductState';
import {
  EkontSenderDetails,
  EsotericaStore,
  MusicStore,
  Tag,
} from '@/sanity.types';
import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { useSenderDetails } from '@/hooks/useSenderDetails';

interface ClientProviderProps {
  products: MusicStore[] | EsotericaStore[];
  tags: Tag[];
  // ekontSender: EkontSenderDetails[];
}

export const ClientProvider = ({
  products,
  tags,
  // ekontSender,
}: ClientProviderProps) => {
  const { addProducts, addTags } = useProductState();

  useEffect(() => {
    // addProducts(products);
    addTags(tags);
    // setSenderDetails(ekontSender[0]);
    // const lenis = new Lenis();

    // function raf(time: any) {
    //   lenis.raf(time);

    //   requestAnimationFrame(raf);
    // }

    // requestAnimationFrame(raf);
    // console.log('Lenis is ready!');
  }, []);

  return <></>;
};
