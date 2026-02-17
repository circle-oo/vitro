import React from 'react';
import { cn } from '../../utils/cn';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  inputClassName?: string;
}

export function DatePicker({ className, inputClassName, style, ...props }: DatePickerProps) {
  return (
    <input
      type="date"
      className={cn('gi', className, inputClassName)}
      style={{
        width: '100%',
        padding: '12px 14px',
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
