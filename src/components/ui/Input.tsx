import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { INPUT_FIELD_STYLE } from './fieldStyles';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string;
}

export function Input({ className, inputClassName, style, ...props }: InputProps) {
  const resolvedStyle = useMemo<React.CSSProperties>(
    () => ({
      ...INPUT_FIELD_STYLE,
      ...style,
    }),
    [style],
  );

  return (
    <input
      className={cn('gi', className, inputClassName)}
      style={resolvedStyle}
      {...props}
    />
  );
}
