import { MapPin } from 'lucide-react';
import React from 'react';

const LocationAndTime = ({ event }: any) => {
  return (
    <div className="text-[12px] flex gap-1.5 items-start">
      <span className="mt-0.5">
        <MapPin size={16} />
      </span>
      <div className="space-y-1">
        <p>{event.location}</p>
        <div className="md:flex gap-2 font-comfortaa">
          <p className="capitalize lg:min-w-[65px] ">
            <span>{event.day}</span> <span>{event.month}</span>{' '}
            <span>{event.year}</span>
          </p>
          <p>{event.time}</p>
        </div>
      </div>
    </div>
  );
};

export default LocationAndTime;
