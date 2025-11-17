// 'use server';

// // import { getMainPageData } from '@/lib/cms/getMainPageData';
// import { getDesignBySlug } from '@/sanity/lib/design/getDesignBySlug';
// import { ImageType } from '@/sanity.types';
// // import { getSectionsControler } from '@/sanity/lib/sections/getSectionsControler';
// import { getAlbumBySlug } from '@/lib/cms/getGallery';

// export interface LoadMoreResult {
//   success: boolean;
//   images: ImageType[];
//   hasNextPage: boolean;
//   currentPage: number;
//   totalImages: number;
//   error?: string;
// }

// const _imagesPerPage = 6;

// export async function loadMoreImages(
//   slug: string,
//   page: number,
// ): Promise<LoadMoreResult | undefined> {
//   const mainPagesSlug = ['music-store', 'bez-granitsi', 'concerts'];

//   try {

//     const totalImagesToLoad = page * _imagesPerPage;
//     const start = (page - 1) * _imagesPerPage;
//     const end = totalImagesToLoad;

//     if (mainPagesSlug.includes(slug)) {
//       const { pageData } = await getMainPageData(slug, , {
//         start,
//         end,
//       });

//       // console.log('SSR-pageData=>>>', pageData);

//       if (!pageData) {
//         return {
//           success: false,
//           images: [],
//           hasNextPage: false,
//           currentPage: page,
//           totalImages: 0,
//           error: 'Gallery not found',
//         };
//       }

//       const totalPages = Math.ceil(pageData.totalImages / _imagesPerPage);

//       return {
//         success: true,
//         images: pageData.images || [],
//         hasNextPage: page < totalPages,
//         currentPage: page,
//         totalImages: pageData.totalImages || 0,
//       };
//     } else {
//       //if the pages are templates
//       const templates = await getAlbumBySlug(slug, { start, end });

//       if (!templates) {
//         return {
//           success: false,
//           images: [],
//           hasNextPage: false,
//           currentPage: page,
//           totalImages: 0,
//           error: 'Gallery not found',
//         };
//       }

//       const totalPages = Math.ceil(templates.totalImages / _imagesPerPage);

//       return {
//         success: true,
//         images: templates.images || [],
//         hasNextPage: page < totalPages,
//         currentPage: page,
//         totalImages: templates.totalImages || 0,
//       };
//     }
//   } catch (error) {
//     console.error('Error fetching images', error);
//     return {
//       success: false,
//       images: [],
//       hasNextPage: false,
//       currentPage: page,
//       totalImages: 0,
//       error: 'Failed to load images',
//     };
//   }
// }
