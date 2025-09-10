import { BannerBottomCurve } from '@/component/banner/banner-bottom-curve/BannerBottomCurve';
import { ContactUs } from '@/component/contact-form/ContactUs';
import { TitleDescription } from '@/component/esoterica-components/TitleDescription';
import { SoundCloudSlider } from '@/component/musicStore-components/sound-cloud/SoundCloudSlider';
import EventGrid from '@/component/products/EventGrid';
import { getMainPageData } from '@/lib/cms/getMainPageData';
import { BannerType, EventsType } from '@/sanity.types';
import { getTemplateCards } from '@/sanity/lib/page/getTemplateCards';
import { getSectionsControler } from '@/sanity/lib/sections/getSectionsControler';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function InteriorDesign() {
  redirect(notFound());

  const controllers = await getSectionsControler();
  const { pageData } = await getMainPageData('design', controllers);
  const designTemplatesList = await getTemplateCards('designType');

  if (!pageData) return notFound();

  const eventsCondition = controllers?.switchDesigns === true;

  // const productsCondition =
  //   pageData?.esotericaProducts?.length > 0 &&
  //   controllers?.switchEsotericaProducts === true;

  const youtubeCondition =
    pageData?.youtubeVideos?.length > 0 && pageData?.switchYouTube === true;

  const soundCloudCondition =
    pageData?.soundcloudVideos?.length > 0 &&
    pageData?.switchSoundcloud === true;

  return (
    <section className="bg-foreground ">
      <div className="design-bg_gradient pb-8 md:pb-12  ">
        {pageData?.banner ? (
          <BannerBottomCurve data={pageData?.banner as BannerType} />
        ) : null}

        <div className=" section_wrapper_xs space-y-[40px] md:space-y-[80px] text-primaryPurple">
          {pageData?.titleDescriptionSection ? (
            <TitleDescription
              data={pageData?.titleDescriptionSection}
              textColor="text-primaryPurple"
            />
          ) : null}
          {eventsCondition ? (
            <EventGrid
              data={designTemplatesList as unknown as EventsType[]}
              type="design"
              heading={pageData?.designsHeading?.heading}
            />
          ) : null}
          {/* {productsCondition ? (
            <ProductsView
              products={pageData?.esotericaProducts}
              bgColor="bg-neutral-950/15"
              heading={pageData?.esotericaProductsHeading?.heading}
            />
          ) : null} */}

          {pageData?.switchContactForm ? (
            <ContactUs
              contacts={pageData?.contactInfo as any}
              bgColor="bg-transparent"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
