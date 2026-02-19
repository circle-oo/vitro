import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { SELECT_FIELD_STYLE } from './fieldStyles';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export function Select({ className, style, children, ...props }: SelectProps) {
  const resolvedStyle = useMemo<React.CSSProperties>(
    () => ({
      ...SELECT_FIELD_STYLE,
      ...style,
    }),
    [style],
  );

  return (
    <select
      className={cn('gi', className)}
      style={resolvedStyle}
      {...props}
    >
      {children}
    </select>
  );
}
