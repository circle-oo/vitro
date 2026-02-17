import React from 'react';
import { cn } from '../../utils/cn';

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 8px',
        fontSize: '11px',
        fontFamily: 'var(--mono)',
        fontWeight: 500,
        lineHeight: 1.4,
        color: 'var(--t3)',
        background: 'var(--gi-bg)',
        border: '1px solid var(--gi-bd)',
        borderRadius: '6px',
        minHeight: '22px',
      }}
    >
      {children}
    </kbd>
  );
}
