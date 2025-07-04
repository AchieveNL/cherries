import React from 'react';

import { cn } from '@/lib/utils';
import { ArrowButton } from '../icons/shared';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  showArrow?: boolean;
  arrowIcon?: any;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  showArrow = false,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50',
    secondary: 'bg-secondary text-primary hover:bg-secondary/90 disabled:bg-secondary/50',
    outline:
      'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white disabled:border-primary/50 disabled:text-primary/50',
    ghost: 'bg-transparent text-primary hover:bg-primary/10 disabled:text-primary/50',
    destructive: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/50',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'font-medium disabled:cursor-not-allowed transition-colors flex items-center justify-center',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
      {showArrow && <ArrowButton className="ml-4" />}
    </button>
  );
};

export default Button;
