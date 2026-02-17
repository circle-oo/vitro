import React from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function Textarea({ className, style, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn('gi', className)}
      style={{
        width: '100%',
        padding: '12px 16px',
        minHeight: '88px',
        fontFamily: 'var(--font)',
        fontSize: '13px',
        color: 'var(--t1)',
        borderRadius: '14px',
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
