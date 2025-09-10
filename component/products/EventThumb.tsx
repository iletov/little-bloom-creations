'use client';
import React from 'react';
import { EventsType } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import Link from 'next/link';
import { formatedEvent } from '@/lib/utils';

const EventThumb = ({ event, type }: { event: EventsType; type?: string }) => {
  const eventDate =
    formatedEvent(event?.date)?.day +
    ' ' +
    formatedEvent(event?.date)?.month +
    ' ' +
    formatedEvent(event?.date)?.year +
    ' ' +
    formatedEvent(event?.date)?.time;

  const bannerImageUrl = event?.bannerImage?.[0]
    ? urlFor(event?.bannerImage?.[0]).url()
    : null;

  const imagesUrl = event?.images?.[0]
    ? urlFor(event?.images?.[0]).url()
    : null;

  const imageUrl =
    (event?.bannerImage?.length ?? 0) > 0 ? bannerImageUrl : imagesUrl;
  // const imageUrl = bannerImageUrl || imagesUrl || '';

  return (
    <Link
      href={`/${type}/${event?.slug?.current}`}
      className="block w-full h-full ">
      <motion.div
        className="relative w-full h-full group  "
        whileHover="hover"
        initial="rest"
        animate="rest">
        {/* Image with zoom effect */}
        <motion.div
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.02 },
          }}
          transition={{ duration: 0.4, ease: 'linear' }}
          className="w-full h-full ">
          <Image
            src={imageUrl ?? ''}
            alt={event?.heading ?? ''}
            width={1200}
            height={1200}
            // fill={true}
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 100vw"
            className="w-full h-full object-cover object-center aspect-square"
          />
        </motion.div>

        {/* Overlay content */}
        <motion.div
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/30 flex items-end">
          <motion.div
            variants={{
              rest: { y: 35, opacity: 0 },
              hover: { y: 5, opacity: 1 },
            }}
            transition={{ duration: 0.4 }}
            className="w-full p-4 bg-black/70 text-white">
            <h3 className="font-semibold text-md mb-2">{event?.heading}</h3>
            {event?.date ? (
              <p className="text-sm opacity-90">{eventDate}</p>
            ) : null}
            {event?.location ? (
              <p className="text-sm flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {event?.location}
              </p>
            ) : null}
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default EventThumb;
