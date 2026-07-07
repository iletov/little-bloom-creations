import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ProviderErrorModalProps {
  error: string | null;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const ProviderErrorModal = ({
  error,
  onClose,
  title = 'Възникна проблем',
  description = 'Моля проверете въведените данни. Системата върна следната грешка:',
}: ProviderErrorModalProps) => {
  
  // Utility to recursively extract the deepest innerError message
  const extractDeepestMessage = (obj: any): string | null => {
    if (obj.innerErrors && Array.isArray(obj.innerErrors) && obj.innerErrors.length > 0) {
      return extractDeepestMessage(obj.innerErrors[0]);
    }
    return obj.message || null;
  };

  const getCleanMessage = (rawError: string | null) => {
    if (!rawError) return '';
    try {
      // Try to extract JSON if it's appended after some text (e.g. "Details: {...}")
      let jsonString = rawError;
      const jsonStartIndex = rawError.indexOf('{');
      const jsonEndIndex = rawError.lastIndexOf('}');
      if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
        jsonString = rawError.substring(jsonStartIndex, jsonEndIndex + 1);
      }
      
      const parsed = JSON.parse(jsonString);
      const cleanMessage = extractDeepestMessage(parsed);
      return cleanMessage ? cleanMessage.trim() : rawError;
    } catch {
      return rawError;
    }
  };

  return (
    <Dialog open={!!error} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-green-0">
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center gap-2 text-[2rem]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-[1.4rem]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-red-500/10 border border-red-500/50 p-5 rounded-lg">
            <p className="text-[1.5rem] font-medium text-red-700 whitespace-pre-wrap break-all leading-relaxed">
              {getCleanMessage(error)}
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            className=" h-[50px] bg-white border border-red-600 text-red-600 hover:ring-1 hover:ring-offset-2 hover:ring-red-600  hover:border-transparent hover:text-red-600 rounded-full text-[1.4rem] px-6"
            onClick={onClose}
          >
            Затвори
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
