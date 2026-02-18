import React from 'react';
import { cn } from '../../utils/cn';
import { fontPx, radiusPx, spacePx } from '../../utils/scaledCss';

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
        gap: spacePx(16),
        marginBottom: spacePx(20),
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacePx(10) }}>
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
                fontSize: fontPx(20),
                padding: `0 ${spacePx(8)} 0 0`,
              }}
            >
              ←
            </button>
          )}
          <h1
            style={{
              fontSize: 'clamp(20px, 1.6vw, 26px)',
              fontWeight: 200,
              letterSpacing: '0',
              color: 'var(--t1)',
              margin: 0,
            }}
          >
            {title}
          </h1>
          {count != null && (
            <span
              style={{
                fontSize: fontPx(12),
                fontWeight: 100,
                color: 'var(--t2)',
                background: 'var(--gi-bg)',
                padding: `${spacePx(2)} ${spacePx(10)}`,
                borderRadius: radiusPx(10),
              }}
            >
              {count}
            </span>
          )}
        </div>
        {subtitle && (
          <div style={{ fontSize: fontPx(13), color: 'var(--t2)', marginTop: spacePx(5) }}>
            {subtitle}
          </div>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}
