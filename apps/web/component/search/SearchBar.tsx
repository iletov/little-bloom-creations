'use client';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import Form from 'next/form';
import React from 'react';
import { motion } from 'framer-motion';

export const SearchBar = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.currentTarget.form?.requestSubmit();
  };
  return (
    <motion.div className="relative w-full max-w-[28rem] md:max-w-[65rem] mx-auto rounded-[0.6rem] overflow-hidden  z-20">
      <Form
        action="/search"
        className="flex gap-3 relative"
        onSubmit={onSubmit}>
        <motion.input
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          style={{ transformOrigin: 'right' }}
          transition={{ duration: 0.45, delay: 0.6 }}
          name="query"
          className="bg-stone-200 w-full min-h-[4rem] py-1 md:py-3 text-[1.4rem] md:text-[2.4rem]
          tracking-wider  shadow-md
          text-foreground focus:outline-none px-4 md:px-6 "
        />
        <Button
          variant="outline"
          className="absolute right-0 h-full px-6 md:px-8 rounded-[0.4rem] [&_svg]:size-6 md:[&_svg]:size-10"
          type="submit"
          // onClick={() => setIsOpenAction(false)}
        >
          <SearchIcon className=" bg-transparent text-fuchsia-100" />
          {/* Search */}
        </Button>
      </Form>
    </motion.div>
  );
};
