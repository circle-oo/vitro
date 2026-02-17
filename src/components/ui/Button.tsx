import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children?: React.ReactNode;
}

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: 'var(--font)',
  fontSize: '13px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  transition: 'all .15s',
  borderRadius: '14px',
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 16px', minHeight: '34px', fontSize: '12px' },
  md: { padding: '10px 22px', minHeight: '44px' },
};

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, var(--p500), var(--p600))',
    color: 'white',
    boxShadow: '0 2px 8px rgba(var(--gl), .22)',
  },
  danger: {
    background: 'linear-gradient(135deg, #F43F5E, #E11D48)',
    color: 'white',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--t2)',
  },
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  style,
  children,
  ...props
}: ButtonProps) {
  const isSecondary = variant === 'secondary';
  return (
    <button
      className={cn(isSecondary && 'gi', className)}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...(isSecondary ? { color: 'var(--t1)' } : variantStyles[variant]),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
