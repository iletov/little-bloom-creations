import { getMainPage } from '@/sanity/lib/page/getMainPage';
import { getAllTags } from '@/sanity/lib/tags/getAllTags';

export async function getMusicStore(slug: string, controlers: any) {
  const [music_tag, pageData] = await Promise.all([
    getAllTags(),
    getMainPage(slug, controlers),
  ]);
  return {
    music_tag,
    pageData,
  };
}

//DELETE
