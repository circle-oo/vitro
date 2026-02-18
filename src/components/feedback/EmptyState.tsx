import React from 'react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  className?: string;
}

export function EmptyState({ icon, title, message, className }: EmptyStateProps) {
  return (
    <div
      className={cn('gc', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 28px',
        textAlign: 'center',
        gap: '10px',
      }}
    >
      {icon && (
        <div style={{ fontSize: '32px', marginBottom: '4px', opacity: 0.6 }}>{icon}</div>
      )}
      <div style={{ fontSize: '15px', fontWeight: 300, color: 'var(--t1)' }}>{title}</div>
      <div style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.5, maxWidth: '280px' }}>
        {message}
      </div>
    </div>
  );
}
