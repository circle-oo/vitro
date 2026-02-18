import React from 'react';
import { cn } from '../../utils/cn';
import { fontPx, radiusPx, spacePx, touchPx } from '../../utils/scaledCss';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function Textarea({ className, style, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn('gi', className)}
      style={{
        width: '100%',
        padding: `${spacePx(12)} ${spacePx(16)}`,
        minHeight: touchPx(88),
        fontFamily: 'var(--font)',
        fontSize: fontPx(13),
        color: 'var(--t1)',
        borderRadius: radiusPx(14),
        outline: 'none',
        resize: 'vertical',
        lineHeight: 1.6,
        transition: 'all .15s',
        ...style,
      }}
      {...props}
    />
  );
}
