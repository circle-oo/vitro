import React from 'react';
import { cn } from '../../utils/cn';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Separator({
  orientation = 'horizontal',
  decorative = true,
  className,
  style,
}: SeparatorProps) {
  const vertical = orientation === 'vertical';

  return (
    <div
      role={decorative ? undefined : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(className)}
      style={{
        background: 'var(--div)',
        width: vertical ? '1px' : '100%',
        height: vertical ? '100%' : '1px',
        alignSelf: 'stretch',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export const Divider = Separator;
