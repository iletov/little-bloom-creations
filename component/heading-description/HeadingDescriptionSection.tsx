import { descriptionType, Title } from '@/types';
import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import HighlightedHeading from './HighlightedHeading';

interface HeadingDescriptionSectionProps {
  data: {
    heading: Title;
    description: descriptionType;
    phrase?: string;
  };
}

const HeadingDescriptionSection = ({
  data,
}: HeadingDescriptionSectionProps) => {
  return (
    <section className="pink-gradient section-y-padding">
      <div className="section_wrapper text-center space-y-6">
        <HighlightedHeading
          text={data?.heading?.title}
          word={data?.heading?.highlightedWord}
          color={data?.heading?.highlightedColor}
          tag="h2"
        />
        <div className="space-y-4 grid justify-center items-center">
          <PortableTextContainer data={data?.description} />
          {data?.phrase ? (
            <p className="text-[2.2rem] md:text-[3.6rem] font-monsieurLa">
              {data?.phrase}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default HeadingDescriptionSection;
