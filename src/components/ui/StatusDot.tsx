import React from 'react';
import { cn } from '../../utils/cn';

const colorMap: Record<string, string> = {
  ok: 'var(--ok)',
  warn: 'var(--wrn)',
  error: 'var(--err)',
  offline: 'var(--t4)',
};

const sizeMap: Record<string, number> = {
  sm: 8,
  md: 10,
  lg: 14,
};

export interface StatusDotProps {
  status: 'ok' | 'warn' | 'error' | 'offline';
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusDot({ status, label, pulse, size = 'md', className }: StatusDotProps) {
  const color = colorMap[status];
  const px = sizeMap[size];

  return (
    <span
      className={cn(className)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
    >
      <span
        style={{
          width: px,
          height: px,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
          boxShadow: pulse ? `0 0 0 0 ${color}` : undefined,
          animation: pulse ? 'vitro-pulse 1.5s ease-in-out infinite' : undefined,
        }}
      />
      {label && <span style={{ fontSize: '12px', color: 'var(--t2)' }}>{label}</span>}
      {pulse && (
        <style>{`
          @keyframes vitro-pulse {
            0%, 100% { box-shadow: 0 0 0 0 ${color}40; }
            50% { box-shadow: 0 0 0 6px ${color}00; }
          }
        `}</style>
      )}
    </span>
  );
}
