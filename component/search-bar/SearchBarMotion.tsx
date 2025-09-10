'use client';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import Form from 'next/form';
import React from 'react';

export const SearchBarMotion = ({
  setIsOpenAction,
}: {
  setIsOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    e.currentTarget.form?.requestSubmit();
    // setIsOpenAction(false);
  };
  return (
    <div className="relative bg-primaryPurple w-full h-full min-h-[40px] rounded-[28px] overflow-hidden ring-1 ring-secondaryPurple shadow-lg shadow-primaryPurple/80">
      <Form
        action="/search"
        className="flex gap-3 relative"
        onSubmit={onSubmit}>
        <input
          name="query"
          className="bg-lightPurple/30 w-full min-h-[40px] py-1.5 text-[0.75rem] md:text-[1.25rem]
          tracking-wider
          text-foreground focus:outline-none  px-5 "
        />
        <Button
          variant="outline"
          className="absolute bg-primaryPurple right-0 h-full px-4 rounded-full"
          type="submit"
          // onClick={() => setIsOpenAction(false)}
        >
          <SearchIcon size={24} className="text-mango bg-transparent" />
          {/* Search */}
        </Button>
      </Form>
    </div>
  );
};
