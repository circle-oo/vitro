import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { DATE_FIELD_STYLE } from './fieldStyles';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  inputClassName?: string;
}

export function DatePicker({ className, inputClassName, style, ...props }: DatePickerProps) {
  const resolvedStyle = useMemo<React.CSSProperties>(
    () => ({
      ...DATE_FIELD_STYLE,
      ...style,
    }),
    [style],
  );

  return (
    <input
      type="date"
      className={cn('gi', className, inputClassName)}
      style={resolvedStyle}
      {...props}
    />
  );
}
