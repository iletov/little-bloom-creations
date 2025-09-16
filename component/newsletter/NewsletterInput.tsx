import { Button } from '@/components/ui/button';
import { MailCheckIcon, SearchIcon } from 'lucide-react';
import React from 'react';

type Props = {};

export default function NewsletterInput({}: Props) {
  return (
    <div className="relative w-full max-w-[28rem] md:max-w-[60rem] mx-auto rounded-[1rem] overflow-hidden z-20">
      <input
        type="email"
        className="bg-white w-full min-h-[5rem] py-1 md:py-3 text-[1.4rem] md:text-[2.4rem]
          tracking-wider shadow-md
          text-foreground focus:outline-none px-4 md:px-6 "
      />
      <Button
        variant="outline"
        className="absolute right-0 h-full px-6 md:px-8 rounded-[unset] [&_svg]:size-6 md:[&_svg]:size-10"
        type="submit"
        // onClick={() => setIsOpenAction(false)}
      >
        <MailCheckIcon className=" bg-transparent text-pink-1" />
        {/* Search */}
      </Button>
    </div>
  );
}
