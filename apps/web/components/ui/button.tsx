import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-[1.6rem] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[1.6rem] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primery: 'text-primary-foreground bg-white hover:bg-green-5 shadow hover:opacity-80 rounded-full',
        default:
          'bg-white text-black hover:text-black shadow-md rounded-full font-bold',
        pink: 'bg-pink-9 text-pink-1 shadow  hover:ring-1 hover:ring-pink-9 hover:ring-offset-1 hover:ring-offset-pink-1 rounded-full font-medium',
        outline: 'bg-green-5 shadow-md rounded-full font-medium',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/60 rounded-full font-medium',
        ghost: 'bg-pink-1 duration-200 px-4 py-5 shadow-md text-green-9 rounded-full font-medium',
        blue: 'bg-blue-600 text-white shadow-md hover:bg-blue-700 rounded-full font-medium',
        destructive: 'bg-red-600 text-white shadow-md hover:bg-red-700 rounded-full font-medium',
        link: 'text-primary underline-offset-4 hover:underline rounded-full font-medium',
      },
      size: {
        default: 'px-12 py-7 h-auto',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        xl: 'h-12',
        icon: 'h-9 w-9 p-4',
        iconLg: 'h-14 w-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
