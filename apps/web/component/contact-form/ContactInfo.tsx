import { cn } from '@/lib/utils';
import React from 'react';

type ContactInfoProps = {
  title?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  index?: number;
  lastElementStyle?: string;
  className?: string;
};

const ContactInfo = ({
  title,
  contact,
  index,
  lastElementStyle,
  className,
}: ContactInfoProps) => {
  return (
    <div
      key={index}
      className={cn(
        `flex flex-1 flex-col px-6 gap-2 mb-3 md:mb-4 font-montserrat`,
        className,
      )}>
      <h4
        className={cn(
          `text-[0.875rem] md:text-[1rem] font-semibold`,
          lastElementStyle,
        )}>
        {title}
      </h4>
      <p className={cn(`text-[0.875rem] md:text-[1rem] `, lastElementStyle)}>
        {contact?.phone}
      </p>
      <p className={cn(`text-[0.875rem] md:text-[1rem] `, lastElementStyle)}>
        {contact?.email}
      </p>
    </div>
  );
};

export default ContactInfo;
