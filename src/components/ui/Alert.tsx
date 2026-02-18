import React from 'react';
import { cn } from '../../utils/cn';

export interface AlertProps {
  variant: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantStyle = {
  info: { bg: '#E0F2FE', fg: '#075985', bd: '#BAE6FD', icon: '\u2139' },
  success: { bg: '#D1FAE5', fg: '#065F46', bd: '#A7F3D0', icon: '\u2713' },
  warning: { bg: '#FEF3C7', fg: '#92400E', bd: '#FDE68A', icon: '\u26A0' },
  danger: { bg: '#FFE4E6', fg: '#9F1239', bd: '#FECDD3', icon: '\u2715' },
} as const;

export function Alert({
  variant,
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const tone = variantStyle[variant];

  return (
    <div
      role="alert"
      className={cn(className)}
      data-variant={variant}
      style={{
        padding: '12px 16px',
        borderRadius: 'var(--r-interactive)',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        fontSize: '13px',
        lineHeight: 1.5,
        background: tone.bg,
        color: tone.fg,
        border: `1px solid ${tone.bd}`,
      }}
    >
      <span aria-hidden="true" style={{ lineHeight: 1.2, marginTop: '1px' }}>{tone.icon}</span>

      <div style={{ minWidth: 0, flex: 1 }}>
        {title && (
          <div style={{ fontWeight: 700, marginBottom: '2px' }}>
            {title}
          </div>
        )}
        <div>{children}</div>
      </div>

      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss alert"
          onClick={onDismiss}
          style={{
            marginLeft: 'auto',
            border: 'none',
            background: 'transparent',
            color: 'inherit',
            opacity: 0.55,
            cursor: 'pointer',
            padding: 0,
            minHeight: 'unset',
            fontSize: '16px',
          }}
        >
          {'\u00D7'}
        </button>
      )}
    </div>
  );
}
