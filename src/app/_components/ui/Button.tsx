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
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  showArrow = false,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'bg-primary text-white px-4 py-2 font-medium hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors flex items-center justify-center',
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
