import React from 'react';
import {
  SlideBannerSection,
  HeadingDescriptionSection,
  FullBackgroundSection,
  HeroBanner,
  CategoryCards,
  Testimonials,
  Newsletter,
} from '..';
import { descriptionType, ImagesType } from '@/types';

interface Section {
  _type: 'section';
  _key: string;
  sectionType: string;
  title: string;
  description: descriptionType;
  pharase?: string;
  backgroundImage: ImagesType;
  mobileImage: ImagesType;
  backgroundImages?: ImagesType[];
  listItems: Array<{
    title: string;
    subTitle?: string;
    description: string;
    image?: ImagesType;
  }>;
  [key: string]: any;
}

interface SectionRendererProps {
  sections: Section[];
}

const SectionRenderer = ({ sections }: SectionRendererProps) => {
  if (!sections || sections.length === 0) return null;

  const sectionComponents = {
    hero: HeroBanner,
    slideBanner: SlideBannerSection,
    headingDescription: HeadingDescriptionSection,
    fullBackground: FullBackgroundSection,
    categoryCard: CategoryCards,
    testimonials: Testimonials,
    newsletter: Newsletter,
  };

  return (
    <>
      {sections.map(section => {
        const { sectionType, _key, ...props } = section;
        const SectionComponent =
          sectionComponents[sectionType as keyof typeof sectionComponents];

        if (!SectionComponent) {
          console.warn(`No component found for section type: ${sectionType}`);
          return (
            <div key={_key} className="py-16 text-center text-red-500">
              Section type "{sectionType}" not implemented
            </div>
          );
        }

        return <SectionComponent key={_key} data={section} {...props} />;
      })}
    </>
  );
};

export default SectionRenderer;
