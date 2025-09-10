import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';
import { PaginationParams } from '@/lib/cms/getMainPageData';

interface Params {
  categories: string[];
  start?: number;
  end?: number;
}

interface YouTubeVideo {
  category: string;
  videoTitle: string;
  url: string;
}

interface YouTubeVideosResponse {
  videos: YouTubeVideo[];
  totalVideos: number;
}

export const getYouTubeVids = unstable_cache(
  async (
    categories: string | string[],
    pagination?: PaginationParams,
  ): Promise<YouTubeVideosResponse> => {
    const categoryArray = Array.isArray(categories) ? categories : [categories];
    const YOU_TUBE_VIDS_QUERY = defineQuery(`
      {
        "totalVideos": count(*[_type == "youtubeVideos" && category in $categories]),
        ${
          pagination
            ? `"videos": *[_type == "youtubeVideos" && category in $categories] | order(_createdAt desc) [$start...$end] {
            category,
            videoTitle,
            url
          }`
            : `"videos": *[_type == "youtubeVideos" && category in $categories] | order(_createdAt desc) {
            category,
            videoTitle,
            url
          }`
        }
      }
    `);

    const params: Params = {
      categories: categoryArray,
    };

    if (pagination) {
      params.start = pagination.start;
      params.end = pagination.end;
    }

    try {
      const youTubeVids = await sanityFetch({
        query: YOU_TUBE_VIDS_QUERY,
        params: params,
      });
      return {
        videos: youTubeVids?.data?.videos || [],
        totalVideos: youTubeVids?.data?.totalVideos || 0,
      };
    } catch (error) {
      console.error('Error fetching youtube videos', error);
      return {
        videos: [],
        totalVideos: 0,
      };
    }
  },
  ['youtube-vids'],
  {
    tags: ['youtube-vids'],
    revalidate: 900,
  },
);
