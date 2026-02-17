import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  children?: React.ReactNode;
}

const variantClass: Record<string, string> = {
  primary: 'bg-p',
  success: 'bg-s',
  danger: 'bg-d',
  warning: 'bg-w',
  info: 'bg-i',
};

export function Badge({
  variant = 'primary',
  size = 'md',
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn('bg', variantClass[variant], className)}
      style={{
        display: 'inline-flex',
        padding: '4px 12px',
        fontSize: size === 'sm' ? '10px' : '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '.5px',
        borderRadius: '20px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
