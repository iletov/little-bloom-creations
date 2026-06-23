import { descriptionType, Title } from '@/types';
import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import FloralDivider from './FloralDivider';
import HighlightedHeading from './HighlightedHeading';

interface HeadingDescriptionSectionProps {
  data: {
    heading: Title;
    eyebrow?: string;
    description: descriptionType;
    phrase?: string;
  };
}

const HeadingDescriptionSection = ({
  data,
}: HeadingDescriptionSectionProps): React.JSX.Element => {
  return (
    <section className="pink-gradient border-y border-pink-5/40 py-14 sm:py-16 lg:py-20 font-montserrat">
      <div className="section_wrapper space-y-7 px-6 text-center sm:px-8 lg:space-y-8">
        {data.eyebrow?.trim() ? (
          <p className="font-montserrat text-[1.2rem] font-medium uppercase tracking-[0.28em] text-green-9 sm:text-[1.4rem]">
            {data.eyebrow.trim()}
          </p>
        ) : null}

        <HighlightedHeading
          text={data.heading.title}
          word={data.heading.highlightedWord}
          color={data.heading.highlightedColor ?? 'var(--green-5)'}
          className="mx-auto max-w-[120rem] text-[3.2rem] sm:text-[4rem] lg:text-[4.8rem]"
          tag="h2"
        />

        <div className="grid place-items-center gap-5">
          <PortableTextContainer
            data={data.description}
            className="mx-auto max-w-[76rem] text-[1.5rem] leading-[1.6] text-slate-600 sm:text-[1.6rem]"
          />
          <div className="grid place-items-center gap-1">
            <FloralDivider />
            {data.phrase?.trim() ? (
              <p className="font-montserrat text-[1.5rem] tracking-[0.12em] text-green-dark sm:text-[1.7rem]">
                {data.phrase.trim()}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeadingDescriptionSection;
