import React from 'react';
import { cn } from '../../utils/cn';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number | string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, count, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(className)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-.3px',
              color: 'var(--t1)',
              margin: 0,
            }}
          >
            {title}
          </h1>
          {count != null && (
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--t3)',
                background: 'var(--gi-bg)',
                padding: '2px 10px',
                borderRadius: '10px',
              }}
            >
              {count}
            </span>
          )}
        </div>
        {subtitle && (
          <div style={{ fontSize: '13px', color: 'var(--t3)', marginTop: '4px' }}>
            {subtitle}
          </div>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}
