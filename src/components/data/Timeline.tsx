import React from 'react';

export interface TimelineEntry {
  time: string;
  title: React.ReactNode;
  detail?: React.ReactNode;
  dotColor?: string;
  dotGlow?: boolean;
}

export interface TimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

export function Timeline({ entries, className }: TimelineProps) {
  return (
    <div className={className}>
      {entries.map((entry, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: '14px',
            padding: '14px 0',
            borderTop: i > 0 ? '1px solid var(--div)' : undefined,
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: entry.dotColor ?? 'var(--p500)',
              marginTop: '4px',
              flexShrink: 0,
              boxShadow: entry.dotGlow !== false ? '0 0 8px rgba(var(--gl), .25)' : undefined,
            }}
          />
          <div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--t4)',
                fontFamily: 'var(--mono)',
              }}
            >
              {entry.time}
            </div>
            <div style={{ fontSize: '13px', marginTop: '2px' }}>{entry.title}</div>
            {entry.detail && (
              <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px', lineHeight: 1.5 }}>
                {entry.detail}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
