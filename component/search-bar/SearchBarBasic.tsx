'use client';
import { SearchIcon } from 'lucide-react';
import Form from 'next/form';
import React from 'react';

export const SearchBarBasic = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.currentTarget.form?.requestSubmit();
  };
  return (
    <div className="relative bg-primaryPurple/80 w-full min-w-[500px] h-full rounded-[28px] overflow-hidden">
      <Form
        action="/search"
        className="flex gap-3 relative"
        onSubmit={onSubmit}>
        <input
          name="query"
          className="bg-lightPurple/30 w-full py-1.5 text-[0.75rem] 
          tracking-wider
          text-foreground focus:outline-none  px-5 "
        />
        <button
          className="absolute right-0 h-full px-4 rounded-full"
          type="submit">
          <SearchIcon size={18} className="text-mango" />
          {/* Search */}
        </button>
      </Form>
    </div>
  );
};
