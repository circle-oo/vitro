import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string;
}

export function Input({ className, inputClassName, style, ...props }: InputProps) {
  return (
    <input
      className={cn('gi', inputClassName)}
      style={{
        width: '100%',
        padding: '12px 16px',
        minHeight: '44px',
        fontFamily: 'var(--font)',
        fontSize: '13px',
        color: 'var(--t1)',
        borderRadius: '14px',
        outline: 'none',
        transition: 'all .15s',
        ...style,
      }}
      {...props}
    />
  );
}
