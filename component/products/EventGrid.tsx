import React from 'react';
import EventThumb from './EventThumb';
import { EventsType } from '@/sanity.types';
import EventBentoGrid from './EventBentoGrid';
import { cn } from '@/lib/utils';

const EventGrid = ({
  data,
  type,
  heading = '',
  styles,
}: {
  data: EventsType[];
  type: string;
  heading?: string;
  styles?: string;
}) => {
  let sortedEvents;

  if (data?.some(d => d.date)) {
    sortedEvents = [...data]?.sort((a, b) => {
      const aTime = new Date(a.date ?? '').getTime();
      const bTime = new Date(b.date ?? '').getTime();
      return aTime - bTime; // Ascending order: earliest date first
    });
  } else {
    sortedEvents = data;
  }

  return (
    <section>
      {heading && (
        <h2 className={cn(` heading2 text-center`, styles)}>{heading}</h2>
      )}
      <div className=" md:grid md:grid-cols-4 md:auto-rows-[150px] gap-4 py-4 my-10">
        {/* First Item: 2x2 */}
        <div className="col-span-2 row-span-2 bg-primaryPurple border-[1px]  border-darkGold  rounded-[20px] overflow-hidden">
          <EventThumb event={sortedEvents[0]} type={type} />
        </div>

        {/* Other Items */}

        {sortedEvents.slice(1).map((event, index) => (
          <div
            key={index}
            className="bg-primaryPurple rounded-[20px]  overflow-hidden hidden md:block  border-[1px] border-darkGold ">
            <EventThumb event={event} type={type} />
          </div>
        ))}

        {/* Other Items Mobile Grid */}
        <EventBentoGrid data={sortedEvents} type={type} className="md:hidden" />
      </div>
    </section>
  );
};

export default EventGrid;
