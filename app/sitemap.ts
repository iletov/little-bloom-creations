import { getTemplateCards } from '@/sanity/lib/page/getTemplateCards';
import { getGallery } from '@/lib/cms/getGallery';
import { getYouTubeVids } from '@/sanity/lib/youtube/getYouTubeVids';

interface Props {
  slug: {
    current: string;
  };
}
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/concerts`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bez-granitsi`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/music-store`,
      lastModified: new Date(),
      changeFrequency: 'montly' as const,
      priority: 0.8,
    },
  ];

  const concerts = await getTemplateCards('concertType');
  const concertPages = concerts.map((concert: Props) => ({
    url: `${baseUrl}/concerts/${concert?.slug?.current}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  const gallery = await getGallery();
  const albumPages = gallery.map((album: Props) => ({
    url: `${baseUrl}/gallery/${album?.slug?.current}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  const videoCategories = ['putyat-kum-sebe-si', 'bez-granitsi', 'music'];
  const videos = await getYouTubeVids(videoCategories);

  const videoPages = videos.videos.map(video => ({
    url: `${baseUrl}/videos/${video?.category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...concertPages, ...albumPages, ...videoPages];
}
