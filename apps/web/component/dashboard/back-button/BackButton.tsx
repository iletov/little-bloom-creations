'use client';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-50">
      <Button
        variant="primery"
        size="icon"
        className="bg-[#FAFAFA] w-12 h-12"
        onClick={() => router.back()}>
        <ChevronLeft size={16} />
      </Button>
    </div>
  );
};

export default BackButton;
