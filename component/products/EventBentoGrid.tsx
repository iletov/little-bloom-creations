import { splitData } from '@/lib/split-data';
import { EventsType } from '@/sanity.types';
import React from 'react';
import EventThumb from './EventThumb';
import { cn } from '@/lib/utils';

const EventBentoGrid = ({
  data,
  className,
  type,
}: {
  data: EventsType[];
  className?: string;
  type?: string;
}) => {
  const columns = splitData(data);
  return (
    <div className={cn(`grid grid-cols-2 gap-4 `, className)}>
      <div className="w-full space-y-4 mt-4">
        {columns[0].slice(1).map((event, index) => {
          const isThird = (index + 1) % 3 === 0;
          const itemHeight = isThird ? 'h-[240px]' : 'h-[150px]';

          return (
            <div
              key={index}
              className={`bg-primaryPurple rounded-[20px] overflow-hidden ${itemHeight}`}>
              <EventThumb event={event} type={type} />
            </div>
          );
        })}
      </div>
      <div className="w-full space-y-4 mt-4">
        {columns[0].slice(1).map((event, index) => {
          const isThird = index % 3 === 0;
          const itemHeight = isThird ? 'h-[240px]' : 'h-[150px]';

          return (
            <div
              key={index}
              className={`bg-primaryPurple rounded-[20px] overflow-hidden ${itemHeight}`}>
              <EventThumb event={event} type={type} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventBentoGrid;
