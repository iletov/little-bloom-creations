import { BannerFlat } from '@/component/banner/banner-flat/BannerFlat';
import { TitleDescription } from '@/component/esoterica-components/TitleDescription';
import { MultiSection } from '@/component/multisection/MultiSection';
import { getMainPageData } from '@/lib/cms/getMainPageData';
import { BannerType } from '@/sanity.types';
import { getSectionsControler } from '@/sanity/lib/sections/getSectionsControler';
import React from 'react';

export const dynamic = 'force-static';
export const revalidate = 86400;

export default async function AboutUs() {
  const controllers = await getSectionsControler();
  const { pageData } = await getMainPageData('about-us', controllers);

  const eventsCondition =
    pageData?.upcommingConcerts?.length > 0 &&
    controllers?.switchConcerts === true;
  return (
    <section
      className={`min-h-[100dvh] about_us-bg_gradient font-montserrat tracking-[0.03em] leading-[120%] pb-8 md:pb-12`}>
      {pageData?.banner ? (
        <BannerFlat data={pageData?.banner as BannerType} />
      ) : null}
      <div className="space-y-[30px] md:space-y-[80px]">
        {pageData?.titleAndDescription ? (
          <TitleDescription data={pageData?.titleAndDescription} />
        ) : null}

        {/* TODO: add MultiSection here */}
        {pageData?.multiSection ? (
          <MultiSection data={pageData?.multiSection} />
        ) : null}
      </div>
    </section>
  );
}
