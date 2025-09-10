import { getBannerBySlug } from '@/sanity/lib/banner/getBannerByTitle';
import { getConcerts } from '@/sanity/lib/events/getConcerts';
import { getEvents } from '@/sanity/lib/events/getEvents';
import { getEsotericaStoreProducts } from '@/sanity/lib/products/getEsotericaStoreProducts';
import { getMusicStoreProducts } from '@/sanity/lib/products/getMusicStoreProducts';
import { getTitleAndDescriptions } from '@/sanity/lib/sections/getTitleAndDescriptions';

export async function getEventsData(slug: string) {
  const [banner, events, titleAndDescription, products] = await Promise.all([
    getBannerBySlug(slug),
    slug === 'events' ? getEvents() : getConcerts(),
    getTitleAndDescriptions(slug),
    slug === 'events' ? getEsotericaStoreProducts() : getMusicStoreProducts(),
  ]);
  return { banner, events, titleAndDescription, products };
}
//DELETE
