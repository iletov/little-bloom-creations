import { getBannerBySlug } from '@/sanity/lib/banner/getBannerByTitle';
import { getContactInfo } from '@/sanity/lib/categories/getContactInfo';
import { getPageCards } from '@/sanity/lib/categories/getPageCards';
import { getSoundCloud } from '@/sanity/lib/youtube/getSoundCloud';
import { getYouTubeVids } from '@/sanity/lib/youtube/getYouTubeVids';

export async function getHomePageData() {
  const [banner, cards, contactInfo] = await Promise.all([
    getBannerBySlug('/'),
    getPageCards('/'),
    getContactInfo('/'),
  ]);
  return { banner, cards, contactInfo };
}
