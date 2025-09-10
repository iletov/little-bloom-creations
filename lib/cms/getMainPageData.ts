import { getBannerBySlug } from '@/sanity/lib/banner/getBannerByTitle';
import { getMainPage } from '@/sanity/lib/page/getMainPage';
import { getSectionsControler } from '@/sanity/lib/sections/getSectionsControler';
import { getAllTags } from '@/sanity/lib/tags/getAllTags';

export interface PaginationParams {
  start: number;
  end: number;
}

export async function getMainPageData(
  slug: string,
  controlers?: any,
  pagination?: PaginationParams,
) {
  const [music_tag, pageData, productBanner] = await Promise.all([
    // getSectionsControler(),
    getAllTags(),
    getMainPage(slug, controlers, pagination),
    getBannerBySlug('product'),
  ]);
  return {
    // controllers,
    music_tag,
    pageData,
    productBanner,
  };
}
