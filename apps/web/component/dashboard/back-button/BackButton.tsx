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
        variant="outline"
        size="icon"
        className="w-12 h-12 rounded-full border-slate-700 bg-[#20212b] text-slate-300 hover:bg-[#30313b] hover:text-white transition-colors"
        onClick={() => router.back()}>
        <ChevronLeft size={20} />
      </Button>
    </div>
  );
};

export default BackButton;
