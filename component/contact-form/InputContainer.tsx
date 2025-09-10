import { ContactUsProps } from '@/actions/createContactUs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React from 'react';

type InputContainerProps = {
  value: string | undefined;
  type: string;
  id: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: string | null;
  placeholder: string;
  className?: string;
};

export const InputContainer = ({
  value,
  type,
  id,
  name,
  onChange,
  errors,
  placeholder,
  className,
}: InputContainerProps) => {
  return (
    <>
      <div className="mb-6 w-full">
        {/* <label htmlFor="name">First Name</label> */}
        <Input
          type={type}
          id={id}
          name={name} //same as the Id
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            `w-full px-2 py-1 rounded-sm ${errors ? 'ring-1 ring-rose-400/40 ' : ''}`,
            className,
          )}
        />
        {errors && (
          <span className="text-red-500 text-sm mt-1 w-full">{errors}</span>
        )}
      </div>
    </>
  );
};
