'use client';
import React, { useState } from 'react';
import { ProductImagesContainer } from './ProductImagesContainer';
import { PortableText } from 'next-sanity';
import { LocateFixedIcon, LocateIcon, Map, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventContactFom from '../contact-form/EventContactFom';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import FavoriteButton from '../cart/favoriteButton/FavoriteButton';
import { cn, expiredDate, formatedEvent } from '@/lib/utils';

const EventItemContainer = ({
  event,
  contact,
}: {
  event: any;
  contact: boolean;
}) => {
  const { isSignedIn, isLoaded } = useUser();
  const [open, setOpen] = useState(false);

  const eventDate =
    formatedEvent(event?.date)?.day +
    ' ' +
    formatedEvent(event?.date)?.month +
    ' ' +
    formatedEvent(event?.date)?.year +
    ' ' +
    formatedEvent(event?.date)?.time;

  return (
    <div className={` block sm:flex gap-8 md:gap-24`}>
      {event?.images && event?.images.length > 0 ? (
        <ProductImagesContainer product={event} />
      ) : null}

      {/* HEADING AND DESCRIPTION */}
      <div className="w-full md:flex-2 space-y-4 ">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: 'easeOut',
            staggerChildren: 0.1,
            delay: 0.5,
          }}
          className="space-y-4">
          <header className="prose">
            <h1 className="text-foreground font-montserrat text-[36px]">
              {event?.heading}
            </h1>
          </header>
          <div>
            <p className="font-comfortaa">{eventDate}</p>
          </div>
          <div>
            <p className="flex items-center gap-2 font-play font-normal">
              <MapPin size={20} />

              {event?.location}
            </p>
          </div>
          <div className="my-2">
            {contact ? (
              <Button
                variant={'default'}
                onClick={() => {
                  setOpen(true);
                }}
                className="w-full md:w-2/3 bg-primaryPurple/80 text-mango font-montserrat hover:bg-primaryPurple/90">
                Запитване
              </Button>
            ) : (
              <Link
                href={`${event?.buyTicketLink}`}
                target="_blank"
                className={
                  expiredDate(event?.date) ? 'pointer-events-none' : ''
                }>
                <Button
                  variant={'default'}
                  className={cn(
                    'w-full md:w-2/3 bg-primaryPurple/80 text-mango font-montserrat hover:bg-primaryPurple/90',
                    expiredDate(event?.date) && 'opacity-50 cursor-not-allowed',
                  )}>
                  Билет
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
        {isSignedIn && isLoaded && (
          <div className="flex  w-full md:w-2/3 justify-center">
            <FavoriteButton
              productId={event?._id}
              productName={event?.heading}
              // initialIsFavorite={false}
            />
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: 'easeOut',
            staggerChildren: 0.1,
            delay: 0.7,
          }}>
          <div className="font-montserrat space-y-4">
            <p className="text-[1.25rem] font-semibold">{event?.subHeading}</p>
            <p>{event?.description}</p>
          </div>

          {/* {event?.productVideo ? (
            <div>
              <VideoComponent
                videoUrl={(event?.productVideo as any)?.videoFile?.url ?? ''}
                thumbnailImage={
                  (product?.productVideo as any)?.thumbnail?.[0]?.url ?? ''
                }
                />
            </div>
          ) : null} */}
          <div className="prose text-foreground">
            {Array.isArray(event?.description) && (
              <PortableText value={event?.description} />
            )}
          </div>
        </motion.div>

        {/* <AddToCartButton product={product} disable={isOutOfStock} /> */}
      </div>
      {contact && open ? (
        <div className="fixed inset-0 w-full h-full bg-black/85 flex items-center justify-center z-50">
          <AnimatePresence key={event._id}>
            <motion.div
              layout
              initial={{ opacity: 0.2, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              // transition={{ duration: 0.2, ease: 'easeInOut' }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="relative w-full max-w-[calc(100%-1rem)] mx-auto md:max-w-xl">
              <EventContactFom
                event={event}
                id={event?._id}
                setOpen={setOpen}
              />
              <Button
                onClick={() => setOpen(false)}
                className="absolute top-0 md:top-2 right-0 md:translate-x-11">
                X
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
};

export default EventItemContainer;
