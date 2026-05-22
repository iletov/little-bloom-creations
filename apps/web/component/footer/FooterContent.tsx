import React from 'react';
import { LayoutProps, SocialMediaType } from '@/sanity.types';
import { FooterLinks } from './FooterLinks';

const FooterContent = ({
  data,
  socialMediaIcons,
}: {
  data: LayoutProps;
  socialMediaIcons: Array<SocialMediaType>;
}) => {
  return (
    <div className="  min-h-[200px] bg-primaryPurple pt-10">
      <div className="section_wrapper_sm  uppercase text-foreground ">
        <h2 className="text-center text-[1.5rem] md:text-[2.5rem] font-play font-semibold">
          {data?.header}
        </h2>

        {data?.links && data?.links?.length > 0 ? (
          <FooterLinks data={data?.links} />
        ) : null}
      </div>
    </div>
  );
};

export default FooterContent;
