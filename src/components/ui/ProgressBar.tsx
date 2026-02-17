import React from 'react';

export interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={className}
      style={{
        height: '6px',
        borderRadius: '3px',
        overflow: 'hidden',
        background: 'var(--div)',
      }}
    >
      <div
        style={{
          height: '100%',
          borderRadius: '3px',
          background: 'linear-gradient(90deg, var(--p500), var(--p400))',
          boxShadow: '0 0 8px rgba(var(--gl), .25)',
          width: `${clamped}%`,
          transition: 'width .6s cubic-bezier(.22, 1, .36, 1)',
        }}
      />
    </div>
  );
}
