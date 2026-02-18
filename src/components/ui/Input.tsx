import React from 'react';
import { cn } from '../../utils/cn';
import { fontPx, radiusPx, spacePx, touchPx } from '../../utils/scaledCss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string;
}

export function Input({ className, inputClassName, style, ...props }: InputProps) {
  return (
    <input
      className={cn('gi', className, inputClassName)}
      style={{
        width: '100%',
        padding: `${spacePx(12)} ${spacePx(16)}`,
        minHeight: touchPx(44),
        fontFamily: 'var(--font)',
        fontSize: fontPx(13),
        color: 'var(--t1)',
        borderRadius: radiusPx(14),
        outline: 'none',
        transition: 'all .15s',
        ...style,
      }}
      {...props}
    />
  );
}
