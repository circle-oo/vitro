import React from 'react';
import { cn } from '../../utils/cn';
import { fontPx, radiusPx, spacePx, touchPx } from '../../utils/scaledCss';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export function Select({ className, style, children, ...props }: SelectProps) {
  return (
    <select
      className={cn('gi', className)}
      style={{
        width: '100%',
        padding: `${spacePx(12)} ${spacePx(16)}`,
        minHeight: touchPx(44),
        fontFamily: 'var(--font)',
        fontSize: fontPx(13),
        color: 'var(--t1)',
        borderRadius: radiusPx(14),
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%237C839B' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `right ${spacePx(14)} center`,
        paddingRight: spacePx(36),
        transition: 'all .15s',
        ...style,
      }}
      {...props}
    >
      {children}
    </select>
  );
}
