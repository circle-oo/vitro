import React from 'react';

export interface HBarItem {
  name: string;
  value: number;
}

export interface VitroHBarChartProps {
  data: HBarItem[];
  className?: string;
}

export function VitroHBarChart({ data, className }: VitroHBarChartProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const max = sorted[0]?.value ?? 1;

  return (
    <div className={className}>
      {sorted.map((item) => (
        <div key={item.name} style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--t2)' }}>{item.name}</span>
            <span style={{ fontSize: '13px', fontFamily: 'var(--mono)', color: 'var(--t3)', fontWeight: 600 }}>
              {item.value}
            </span>
          </div>
          <div
            style={{
              height: '22px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'rgba(var(--gl), .06)',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: '8px',
                background: 'linear-gradient(90deg, var(--p400), var(--p500))',
                width: `${(item.value / max) * 100}%`,
                transition: 'width .6s cubic-bezier(.22, 1, .36, 1)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
