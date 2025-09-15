import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[1rem] text-[1.6rem] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primery:
          'bg-mango text-primary-foreground shadow hover:opacity-80 transition-all duration-200',
        default:
          'bg-green-1 text-green-dark hover:text-green-1 shadow hover:bg-green-5 hover:ring-1 hover:ring-green-5 hover:ring-offset-1 hover:ring-offset-green-1 ',
        pink: 'bg-pink-9 text-pink-1 shadow  hover:ring-1 hover:ring-pink-9 hover:ring-offset-1 hover:ring-offset-pink-1',
        outline:
          'border border-input bg-emerald-700 hover:bg-emerald-600  shadow-sm  hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost:
          'border-[2px] border-white/70 hover:border-accent-foreground duration-200 px-8 py-5 shadow-lg hover:text-accent-foreground rounded-full',
        hoverBlue: 'hover:bg-darkBlue hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: ' px-12 py-3',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
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
