import React from 'react';
import { cn } from '../../utils/cn';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  label?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Separator({
  orientation = 'horizontal',
  decorative = true,
  label,
  className,
  style,
}: SeparatorProps) {
  const vertical = orientation === 'vertical';

  if (vertical) {
    return (
      <div
        role={decorative ? undefined : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(className)}
        style={{
          background: 'var(--div)',
          width: '1px',
          height: '100%',
          alignSelf: 'stretch',
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  if (label == null || label === '') {
    return (
      <div
        role={decorative ? undefined : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(className)}
        style={{
          background: 'var(--div)',
          width: '100%',
          height: '1px',
          alignSelf: 'stretch',
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      role={decorative ? undefined : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        color: 'var(--t4)',
        ...style,
      }}
    >
      <span style={{ flex: 1, height: '1px', background: 'var(--div)' }} />
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          whiteSpace: 'nowrap',
          color: 'var(--t4)',
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1, height: '1px', background: 'var(--div)' }} />
    </div>
  );
}

export const Divider = Separator;
