import React from 'react';
import { cn } from '../../utils/cn';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number | string;
  action?: React.ReactNode;
  onBack?: () => void;
  className?: string;
}

export function PageHeader({ title, subtitle, count, action, onBack, className }: PageHeaderProps) {
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
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              style={{
                color: 'var(--t3)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '0 8px 0 0',
              }}
            >
              ←
            </button>
          )}
          <h1
            style={{
              fontSize: 'clamp(18px, 1.5vw, 24px)',
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
