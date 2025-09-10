import { getSidebarLinks } from '@/sanity/lib/sections/getSidebarLinks';
import { getSocialMediaIcons } from '@/sanity/lib/sections/getSocialMediaIcons';
import { unstable_cache } from 'next/cache';

export const getLayoutData = unstable_cache(
  async () => {
    const [layoutData] = await Promise.all([
      getSidebarLinks(),
      // getSocialMediaIcons(),
    ]);
    return { layoutData };
  },
  ['layout-data'],
  {
    tags: ['layout-data'],
    revalidate: 900,
  },
);
