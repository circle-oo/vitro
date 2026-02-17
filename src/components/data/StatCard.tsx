import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  valueColor?: string;
  children?: React.ReactNode; // sparkline slot
}

export function StatCard({
  label,
  value,
  delta,
  deltaType = 'neutral',
  valueColor,
  children,
}: StatCardProps) {
  const deltaColors = {
    positive: 'var(--ok)',
    negative: 'var(--err)',
    neutral: 'var(--t3)',
  };

  return (
    <>
      <span className="lbl">{label}</span>
      <div
        style={{
          fontSize: '36px',
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
          marginBottom: '8px',
          color: valueColor,
        }}
      >
        {value}
      </div>
      {delta && (
        <div
          style={{
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: deltaColors[deltaType],
          }}
        >
          {delta}
        </div>
      )}
      {children}
    </>
  );
}
