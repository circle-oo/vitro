import React from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export function Select({ className, style, children, ...props }: SelectProps) {
  return (
    <select
      className={cn('gi', className)}
      style={{
        width: '100%',
        padding: '12px 16px',
        minHeight: '44px',
        fontFamily: 'var(--font)',
        fontSize: '13px',
        color: 'var(--t1)',
        borderRadius: '14px',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%237C839B' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        paddingRight: '36px',
        transition: 'all .15s',
        ...style,
      }}
      {...props}
    >
      {children}
    </select>
  );
}
