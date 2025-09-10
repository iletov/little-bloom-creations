import { ClientProvider } from '@/component/client-provider/ClientProvider';
import NavigationWrapper from '@/component/cards/navigation-wrapper/NavigationWrapper';
import { ContactUs } from '@/component/contact-form/ContactUs';
import { BannerType } from '@/sanity.types';
import { getMainPageData } from '@/lib/cms/getMainPageData';
import { ProductBanner } from '@/component/banner/product-banner/ProductBanner';
import { getSectionsControler } from '@/sanity/lib/sections/getSectionsControler';
import { BannerBottomCurve } from '@/component/banner/banner-bottom-curve/BannerBottomCurve';
import { getBannerBySlug } from '@/sanity/lib/banner/getBannerByTitle';
import { urlFor } from '@/sanity/lib/image';
import StructuredData from '@/component/Seo/StructuredData';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBannerBySlug('/');

  return {
    title: 'Начална страница',
    description: 'Начална страница',
    openGraph: {
      title: 'Невена Цонева - Официален сайт',
      description: 'Начална страница',
      url: process.env.NEXT_PUBLIC_SITE_URL,
      images: [
        {
          url: urlFor(settings?.bannerImage?.[0]).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: 'Невена Цонева',
        },
      ],
    },
  };
}

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Home() {
  const controllers = await getSectionsControler();
  const { pageData, music_tag, productBanner } = await getMainPageData(
    '/',
    controllers,
  );

  const websiteSchema = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    name: 'Невена Цонева',
    alternateName: 'Невена Цонева - Официален сайт',
  };

  return (
    <>
      <StructuredData data={websiteSchema} />
      <section className="homepage-bg_gradient pt-4 pb-8 md:pb-12">
        <ClientProvider products={[]} tags={music_tag} />
        <div className="space-y-[20px] md:space-y-[20px]">
          {pageData?.banner ? (
            <BannerBottomCurve data={pageData?.banner as BannerType} />
          ) : null}
          {pageData?.navCards ? (
            <NavigationWrapper data={pageData?.navCards?.[0]} />
          ) : null}
          <div className="space-y-[40px] md:space-y-[60px] ">
            {productBanner ? <ProductBanner data={productBanner} /> : null}

            {/* {pageData?.switchEsotericaProducts ||
          pageData?.switchMusicProducts ? (
            <ProductsView
            // products={products}
            products={[
              ...((pageData?.switchEsotericaProducts &&
                  pageData?.esotericaProducts?.filter(Boolean)) ||
                  []),
                ...((pageData?.switchMusicProducts &&
                pageData?.musicProducts?.filter(Boolean)) ||
                  []),
                  ]}
                  bgColor="bg-neutral-950/15"
                  styles="glossy-text-section"
                  heading={
                    pageData?.musicProductsHeading?.heading ||
                    pageData?.esotericaProductsHeading?.heading
                    }
            />
            ) : null} */}
            {pageData?.switchContactForm ? (
              <ContactUs
                contacts={pageData?.contactInfo as any}
                styledText={true}
              />
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
