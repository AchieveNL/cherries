import { cva } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';
import { ArrowButton } from '../icons/shared';

import type { VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base classes
  "inline-flex items-center justify-center gap-2 whitespace-nowrap  text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50',
        secondary: 'bg-secondary text-primary hover:bg-secondary/90 disabled:bg-secondary/50',
        outline:
          'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white disabled:border-primary/50 disabled:text-primary/50',
        ghost: 'bg-transparent text-primary hover:bg-primary/10 disabled:text-primary/50',
        destructive: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/50',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  showArrow?: boolean;
  arrowIcon?: any;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  showArrow = false,
  arrowIcon,
  variant,
  size,
  ...props
}) => {
  const ArrowIcon = arrowIcon || ArrowButton;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(buttonVariants({ variant, size }), 'group', className)}
      {...props}
    >
      {children}
      {showArrow && (
        <ArrowIcon
          className={cn(
            'transition-transform duration-200 ease-in-out',
            'group-hover:translate-x-1',
            size === 'sm' ? 'ml-2' : size === 'lg' || size === 'xl' ? 'ml-3' : 'ml-2'
          )}
        />
      )}
    </button>
  );
};

export default Button;
