import React from 'react';

interface VitroSparklineProps {
  data: number[];
  height?: number;
  className?: string;
}

export function VitroSparkline({ data, height = 36, className }: VitroSparklineProps) {
  const max = Math.max(...data, 1);

  return (
    <div
      className={className}
      style={{
        marginTop: '14px',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'flex-end',
        gap: '3px',
      }}
    >
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            borderRadius: '4px 4px 0 0',
            minHeight: '4px',
            height: `${(v / max) * 100}%`,
            background: i === data.length - 1 ? 'var(--p500)' : 'rgba(var(--gl), .16)',
          }}
        />
      ))}
    </div>
  );
}
