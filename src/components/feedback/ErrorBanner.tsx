import React from 'react';
import { cn } from '../../utils/cn';

interface ErrorBannerProps {
  message: string;
  className?: string;
}

export function ErrorBanner({ message, className }: ErrorBannerProps) {
  return (
    <div
      className={cn(className)}
      style={{
        padding: '12px 18px',
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--err)',
        background: 'color-mix(in srgb, var(--err) 8%, transparent)',
        border: '1px solid color-mix(in srgb, var(--err) 20%, transparent)',
        borderRadius: '12px',
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}
