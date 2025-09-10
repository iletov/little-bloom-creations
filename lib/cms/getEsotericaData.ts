import { getBannerBySlug } from '@/sanity/lib/banner/getBannerByTitle';
import { getEvents } from '@/sanity/lib/events/getEvents';
import { getEsotericaStoreProducts } from '@/sanity/lib/products/getEsotericaStoreProducts';
import { getTitleAndDescriptions } from '@/sanity/lib/sections/getTitleAndDescriptions';
import { getAllTags } from '@/sanity/lib/tags/getAllTags';
import { getYouTubeVids } from '@/sanity/lib/youtube/getYouTubeVids';

export async function getEsotericaPageData(slug: string) {
  const [products, esoterica_tag, youtubeVideo, banner, section2] =
    await Promise.all([
      getEsotericaStoreProducts(),
      getAllTags(),
      // getYouTubeVids(),
      getBannerBySlug(slug),
      getTitleAndDescriptions(slug),
      getEvents(),
    ]);

  return { products, esoterica_tag, youtubeVideo, banner, section2 };
}
//DELETE
