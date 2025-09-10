'use client';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import Form from 'next/form';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import './style.css';

export const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Close when click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative z-50" ref={wrapperRef}>
      {!isOpen && (
        <Button
          onClick={handleIconClick}
          className="p-2 rounded-full bg-lightPurple/30 text-mango">
          <SearchIcon size={20} />
        </Button>
      )}

      {isOpen && (
        <Form
          action="/search"
          className="relative top-4 left-1/2 translate-x-1/2 w-[220px]"
          onSubmit={e => e.currentTarget.form?.requestSubmit()}>
          <div className="relative">
            <motion.input
              ref={inputRef}
              name="query"
              type="text"
              placeholder="Search..."
              className="search-animated-input pr-10"
              initial={false}
              animate={{
                width: isOpen ? '80%' : '50px',
                scale: isOpen ? 1.1 : 1,
                zIndex: isOpen ? 10 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
            <Button
              type="submit"
              variant={'link'}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-mango">
              <SearchIcon size={18} />
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};
