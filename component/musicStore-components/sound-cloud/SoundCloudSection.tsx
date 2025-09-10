import { Heading } from '@/component/text/Heading';
import { SoundcloudType } from '@/sanity.types';
import React from 'react';
import Track from './Track';

interface Props {
  data?: SoundcloudType[];
  heading?: string;
}

const SoundCloudSection = ({ data, heading }: Props) => {
  return (
    <section className="section_wrapper_xl">
      {heading ? (
        <Heading
          data={heading ?? ''}
          className=" heading2 mb-8 md:mb-12 flex-wrap max-w-[90%] mx-auto"
        />
      ) : null}

      <div className="grid-container">
        {data?.map((track: any, index: number) => (
          <Track
            track={track?.trackId}
            key={track?.trackId + index}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default SoundCloudSection;
