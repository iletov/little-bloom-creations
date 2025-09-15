import { descriptionType } from '@/types';
import React from 'react';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';

interface HeadingDescriptionSectionProps {
  data: {
    title: string;
    description: descriptionType;
    phrase?: string;
  };
}

const HeadingDescriptionSection = ({
  data,
}: HeadingDescriptionSectionProps) => {
  return (
    <section className="bg-pink-5/60 section-y-padding">
      <div className="section_wrapper text-center space-y-6">
        <h2 className="text-[2.4rem] md:text-[4.8rem] font-semibold leading-[1.3] font-orbitron text-green-dark">
          {data?.title}
        </h2>
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
