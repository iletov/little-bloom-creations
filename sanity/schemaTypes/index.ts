import { type SchemaTypeDefinition } from 'sanity';
import { blockContentType } from './blockContentType';
import { contactFormType } from './contactFormType';
import { videoType } from './videoType';
import { youtubeVideosType } from './youtubeVideosType';
import { bannerType } from './page-types/bannerType';
import { titleDescriptionType } from './page-types/titleDescriptionType';
import { eventsType } from './page-types/eventsType';
import { soundcloudType } from './page-types/soundcloundType';
import cardsType from './page-types/cardsType';
import { contactInfoType } from './orderInfoType';
import { concertType } from './page-types/concertType';
import { sidebarType } from './sideBarType';
import { socialMediaType } from './page-types/socialMediaType';
import { homepageSchema } from './mainPages/homepageSchema';
import { headingType } from './page-types/headingType';
import { designType } from './page-types/designType';
import { infoPageSchema } from './infoPages/infoPageSchema';
import { multiSectionType } from './page-types/multiSectionType';
import { albumType } from './page-types/galleryType';
// import { categoryType } from './categoryType';
// import { musicStoreType } from './musicStoreType';
// import { salesType } from './salesType';
// import { esotericaStoreType } from './esotericaStoreType';
// import { ekontType } from './ekontType';
// import { orderType } from './orderType';
// import { tagType } from './tagType';
// import { designsType } from './designsType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    homepageSchema,
    blockContentType,
    sidebarType,
    contactInfoType,
    contactFormType,
    videoType,
    cardsType,
    titleDescriptionType,
    headingType,
    youtubeVideosType,
    albumType,
    bannerType,
    eventsType,
    concertType,
    soundcloudType,
    socialMediaType,
    designType,
    infoPageSchema,
    multiSectionType,
    // salesType,
    // ekontType,
    // categoryType,
    // musicStoreType,
    // esotericaStoreType,
    // orderType,
    // designsType,
    // tagType,
  ],
};
