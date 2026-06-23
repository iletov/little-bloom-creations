'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface EmbroideryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: any[];
  onSelect: (image: any) => void;
  selectedImageAlt?: string;
}

const EmbroideryModal = ({ isOpen, onClose, images, onSelect, selectedImageAlt }: EmbroideryModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Изберете Бродерия</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {images && images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, index) => {
                    const isSelected = selectedImageAlt === img.alt;
                    return (
                      <div 
                        key={index} 
                        className={`cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${isSelected ? 'border-green-dark shadow-md scale-[1.02]' : 'border-transparent hover:border-gray-300'}`}
                        onClick={() => {
                          onSelect(img);
                          onClose();
                        }}
                      >
                        <div className="aspect-square relative w-full bg-gray-100">
                          {img && (
                            <Image
                              src={urlFor(img).url()}
                              alt={img.alt || 'Бродерия'}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        {img.alt && (
                          <div className="p-2 text-center text-sm font-medium bg-gray-50">
                            {img.alt}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center py-10 text-gray-500">Няма намерени бродерии.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmbroideryModal;
