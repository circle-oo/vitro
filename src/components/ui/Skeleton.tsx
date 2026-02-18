import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  circle?: boolean;
  className?: string;
  style?: React.CSSProperties;
  pulse?: boolean;
}

export interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string | number;
  className?: string;
  lineHeight?: number | string;
  gap?: number | string;
}

export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  circle = false,
  className,
  style,
  pulse = false,
}: SkeletonProps) {
  const resolvedWidth = circle ? height : width;

  return (
    <span
      className={cn('vitro-skeleton', pulse && 'pulse', className)}
      data-circle={circle ? 'true' : undefined}
      aria-hidden="true"
      style={{
        width: resolvedWidth,
        height,
        borderRadius: circle ? '50%' : radius,
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

export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  className,
  lineHeight = 14,
  gap = 8,
}: SkeletonTextProps) {
  return (
    <div className={cn(className)} style={{ display: 'grid', gap }}>
      {Array.from({ length: Math.max(1, lines) }).map((_, index) => (
        <Skeleton
          key={index}
          height={lineHeight}
          width={index === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
}
