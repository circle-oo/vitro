import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: React.CSSProperties;
  pulse?: boolean;
}

export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  className,
  style,
  pulse = false,
}: SkeletonProps) {
  return (
    <span
      className={cn('vitro-skeleton', pulse && 'pulse', className)}
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius: radius,
        display: 'inline-block',
        background:
          'linear-gradient(100deg, rgba(var(--gl), .08) 20%, rgba(var(--gl), .2) 45%, rgba(var(--gl), .08) 70%)',
        backgroundSize: '220% 100%',
        animation: pulse ? undefined : 'vitro-skeleton-shimmer 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  );
}
