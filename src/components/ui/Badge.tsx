import React from 'react';
import { cn } from '../../utils/cn';
import { fontPx, radiusPx, spacePx } from '../../utils/scaledCss';

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
        padding: `${spacePx(4)} ${spacePx(12)}`,
        fontSize: size === 'sm' ? fontPx(10) : fontPx(11),
        fontWeight: 300,
        textTransform: 'uppercase',
        letterSpacing: '.5px',
        borderRadius: radiusPx(20),
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
