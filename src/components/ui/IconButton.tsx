import React from 'react';
import { cn } from '../../utils/cn';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles: Record<NonNullable<IconButtonProps['size']>, React.CSSProperties> = {
  sm: { width: '34px', height: '34px', borderRadius: '10px', fontSize: '14px' },
  md: { width: '40px', height: '40px', borderRadius: '12px', fontSize: '16px' },
  lg: { width: '46px', height: '46px', borderRadius: '14px', fontSize: '18px' },
};

const variantStyles: Record<'primary' | 'ghost' | 'danger', React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, var(--p500), var(--p600))',
    color: 'white',
    boxShadow: '0 2px 8px rgba(var(--gl), .22)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--t2)',
  },
  danger: {
    background: 'linear-gradient(135deg, #F43F5E, #E11D48)',
    color: 'white',
  },
};

export function IconButton({
  variant = 'secondary',
  size = 'md',
  className,
  style,
  children,
  ...props
}: IconButtonProps) {
  const isSecondary = variant === 'secondary';

  return (
    <button
      type="button"
      className={cn(isSecondary && 'gi', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font)',
        fontWeight: 600,
        lineHeight: 1,
        transition: 'all .15s',
        color: isSecondary ? 'var(--t2)' : undefined,
        ...sizeStyles[size],
        ...(isSecondary ? {} : variantStyles[variant]),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
