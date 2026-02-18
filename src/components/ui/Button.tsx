import React from 'react';
import { cn } from '../../utils/cn';
import { fontPx, radiusPx, spacePx, touchPx } from '../../utils/scaledCss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children?: React.ReactNode;
}

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacePx(8),
  fontFamily: 'var(--font)',
  fontSize: fontPx(13),
  fontWeight: 300,
  border: 'none',
  cursor: 'pointer',
  transition: 'all .15s',
  borderRadius: radiusPx(14),
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: `${spacePx(6)} ${spacePx(16)}`, minHeight: touchPx(34), fontSize: fontPx(12) },
  md: { padding: `${spacePx(10)} ${spacePx(22)}`, minHeight: touchPx(44) },
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
