'use server';
import { getYouTubeVids } from '@/sanity/lib/youtube/getYouTubeVids';

export interface LoadMoreResult {
  success: boolean;
  videos: any;
  hasNextPage: boolean;
  currentPage: number;
  totalVideos: number;
  error?: string;
}

const _itemsPerPage = 8;

export async function loadMoreVideos(
  videoCategories: string | string[],
  page: number,
): Promise<LoadMoreResult | undefined> {
  try {
    const totalImagesToLoad = page * _itemsPerPage;
    const start = (page - 1) * _itemsPerPage;
    const end = totalImagesToLoad;
    const pagination = { start, end };

    const youTubeData = await getYouTubeVids(videoCategories, pagination);

    if (!youTubeData) {
      return {
        success: false,
        videos: [],
        hasNextPage: false,
        currentPage: page,
        totalVideos: 0,
        error: 'Не са открити видеа',
      };
    }

    const totalPages = Math.ceil(youTubeData.totalVideos / _itemsPerPage);

    return {
      success: true,
      videos: youTubeData.videos || [],
      hasNextPage: page < totalPages,
      currentPage: page,
      totalVideos: youTubeData.totalVideos || 0,
    };
  } catch (error) {
    console.error('Error fetching videos', error);
    return {
      success: false,
      videos: [],
      hasNextPage: false,
      currentPage: page,
      totalVideos: 0,
      error: 'Възникна грешка при зареждането...',
    };
  }
}
