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
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'black';
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
    black: 'bg-black text-white hover:bg-black/90 disabled:bg-black/50',
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
        // Using 'group/button' to create a scoped group that won't conflict with other groups
        'group/button relative  overflow-hidden font-medium disabled:cursor-not-allowed transition-colors flex items-center justify-center',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      style={{
        lineHeight: 'normal',
      }}
      {...props}
    >
      {children}
      {showArrow && <ArrowButton className="ml-4" />}
      {/* Shimmer animation overlay - now uses group-hover/button to target only this button's group */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ease-out"></div>
    </button>
  );
};

export default Button;
