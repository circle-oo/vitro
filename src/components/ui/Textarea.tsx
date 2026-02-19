import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { TEXTAREA_FIELD_STYLE } from './fieldStyles';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function Textarea({ className, style, ...props }: TextareaProps) {
  const resolvedStyle = useMemo<React.CSSProperties>(
    () => ({
      ...TEXTAREA_FIELD_STYLE,
      ...style,
    }),
    [style],
  );

  return (
    <textarea
      className={cn('gi', className)}
      style={resolvedStyle}
      {...props}
    />
  );
}
