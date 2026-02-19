import React from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  valueColor?: string;
  children?: React.ReactNode; // sparkline slot
}

const DELTA_COLORS = {
  positive: 'var(--ok)',
  negative: 'var(--err)',
  neutral: 'var(--t3)',
} as const;

const VALUE_STYLE: React.CSSProperties = {
  fontSize: '38px',
  fontWeight: 200,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1,
  marginBottom: '8px',
};

const DELTA_STYLE: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 200,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

export function StatCard({
  label,
  value,
  delta,
  deltaType = 'neutral',
  valueColor,
  children,
}: StatCardProps) {
  return (
    <>
      <span className="lbl">{label}</span>
      <div style={{ ...VALUE_STYLE, color: valueColor }}>
        {value}
      </div>
      {delta && (
        <div style={{ ...DELTA_STYLE, color: DELTA_COLORS[deltaType] }}>
          {delta}
        </div>
      )}
      {children}
    </>
  );
}
