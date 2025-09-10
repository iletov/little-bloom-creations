import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type AlertBoxProps = {
  title?: string;
  description?: string;
  reset?: () => void;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AlertBox = ({
  title = '',
  description = '',
  reset = () => {},
  setOpen = () => {},
}: AlertBoxProps) => {
  const handleClick = () => {
    setOpen(false);
    reset();
  };

  return (
    <div className="section_wrapper">
      <AlertDialog defaultOpen={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
            <AlertDialogAction onClick={handleClick}>ОК</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
