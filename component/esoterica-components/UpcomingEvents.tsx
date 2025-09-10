'use client';
import { Button } from '@/components/ui/button';
import { cn, expiredDate } from '@/lib/utils';
import { EventsType } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import LocationAndTime from './LocationAndTime';
import { motion, useInView } from 'framer-motion';

export const UpcomingEvents = ({
  data,
  eventType,
  heading = '',
  sliceCount = undefined,
}: {
  data: EventsType[];
  eventType: string;
  heading?: string;
  sliceCount?: number | undefined;
}) => {
  const formattedEvents = data?.map((event: EventsType) => {
    const date = new Date(event?.date ?? '');
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'long' }).slice(0, 3);
    const year = date.getFullYear();
    const time = date.toLocaleString('default', {
      hour: 'numeric',
      minute: 'numeric',
    });

    return {
      ...event,
      day,
      month,
      year,
      time,
    };
  });

  const shouldSlice =
    sliceCount !== undefined
      ? formattedEvents.slice(0, sliceCount)
      : formattedEvents;

  return (
    <section className="max-w- mx-auto space-y-8">
      <h2 className="heading2 text-center">{heading}</h2>

      {shouldSlice.map((event: any, index: number) => (
        <article
          key={index + 'upcomingEvents'}
          className={cn(
            'space-y-3 md:flex w-full justify-between min-h-[80px]  border-lightPurple/80 border-t-[1px] py-3 last:border-b-[1px] dark-green-gradient px-6 transition-all duration-500 ease-in-out',
          )}>
          <div className="flex w-full gap-4 md:gap-8">
            {/* IMAGE */}
            <div className="relative w-[6rem] h-auto aspect-square">
              <Image
                src={urlFor(event?.images[0]).url()}
                alt={`${event.heading}`}
                fill={true}
                className={cn(
                  ' object-cover ',
                  expiredDate(event.date) ? 'grayscale' : '',
                )}
              />
              <div
                className={cn(
                  'absolute inset-0 ',
                  expiredDate(event.date)
                    ? 'bg-stone-500 mix-blend-multiply'
                    : '',
                )}></div>
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-[1rem] md:text-[1.5rem] font-semibold">
                {event.heading}
              </p>
              {/* <div className="w-full border-b-[1px] border-white my-1" /> */}
              <LocationAndTime event={event} />
            </div>
          </div>

          <div className="grid gap-2">
            <Link
              href={`${event?.buyTicketLink}`}
              target="_blank"
              className={cn(
                'w-full',
                expiredDate(event.date) ? 'pointer-events-none' : '',
              )}>
              <Button
                variant={'ghost'}
                className={cn(
                  'w-full text-primaryPurple border-mango bg-mango font-montserrat ',
                  expiredDate(event.date)
                    ? 'bg-mango opacity-50 cursor-not-allowed'
                    : '',
                )}>
                {!expiredDate(event.date) ? 'Билет' : 'Изтекъл'}
              </Button>
            </Link>

            <Link
              href={`${eventType}/${event?.slug.current}`}
              className="w-full">
              <Button variant={'ghost'} className="w-full [&_svg]:size-4">
                Виж още <ArrowRight />
              </Button>
            </Link>
          </div>
        </article>
      ))}

      {sliceCount !== undefined && (
        <Link
          href={`/${eventType}`}
          className="w-fit flex justify-center mx-auto">
          <Button variant={'ghost'} className="w-full max-w-[8.048rem]">
            Всички
          </Button>
        </Link>
      )}
    </section>
  );
};
