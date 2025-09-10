import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { unstable_cache } from 'next/cache';
import { PaginationParams } from '@/lib/cms/getMainPageData';

export interface Params {
  slug: string;
  start?: number;
  end?: number;
}

export const getMainPage = unstable_cache(
  async (slug: string, controlers?: any, pagination?: PaginationParams) => {
    const eventsFields = !!controlers?.switchEvents
      ? `
      switchEvents,
      eventsHeading->,
      upcommingEvents[]->{
        ...,
        "messages": undefined
      },
  `
      : ``;

    const concertsFields = !!controlers?.switchConcerts
      ? `
      switchConcerts,
      concertsHeading->,
      upcommingConcerts[]->,
    `
      : ``;

    const designsFields = !!controlers?.switchDesigns
      ? `
      switchDesigns,
      designsHeading->,
      designsList[]->{
        ...,
        bannerImage[]->,
        bannerImageMobile[]->,
        eventVideos[]->{
        _id,
        _type,
        title,
        'videoFile': videoFile.asset->{
          url
        },
        'thumbnail': thumbnail[].asset->{
          url
        },
      }, 
        "messages": undefined
      },
    `
      : ``;

    const MAIN_PAGE_QUERY = defineQuery(`
    
    *[ _type == "homepageSchema" && slug.current == $slug ][0] {
      ...,
      banner->,
      navCards[]->,
      titleAndDescription->,

      // Events
      ${eventsFields}

      //Concerts
      ${concertsFields}
      
      //Design
      ${designsFields}

      //Music Store
      switchMusicProducts,
      musicProductsHeading->,
      musicProducts[]->{
        ...,
        category[]->{
          title
        }
      },

      //Esoterica store
      switchEsotericaProducts,
      esotericaProductsHeading->,
      esotericaProducts[]->{
        ...,
        category[]->{
          title
        }
      },

      //Other
      eventVideos[]->{
        _id,
        _type,
        title,
        'videoFile': videoFile.asset->{
          url
        },
        'thumbnail': thumbnail[].asset->{
          url
        },
      }, 

      multiSection[]->,
      
      switchYouTube,
      youtubeHeading->,
      youtubeVideos[]->,

      switchSoundcloud,
      soundcloudHeading->,
      soundcloudVideos[]->,

      //Contact
      switchContactForm,
      contactInfo->,

      //images
      "totalImages": count(images),
      ${pagination ? `"images": images[$start...$end]` : ' "images": images'} {
        _key,
        asset-> {
          _ref,
          url
        },
        hotspot
      }
    }
    
    `);

    const params: Params = { slug };
    if (pagination) {
      params.start = pagination.start;
      params.end = pagination.end;
    }

    try {
      const page = await sanityFetch({
        query: MAIN_PAGE_QUERY,
        params: params,
      });
      return page.data || null;
    } catch (error) {
      console.error('Error fetching concerts', error);
      return null;
    }
  },
  ['main-page'],
  {
    tags: ['main-page'],
    revalidate: 60,
  },
);
