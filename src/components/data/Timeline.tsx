import React from 'react';
import { fontPx, spacePx } from '../../utils/scaledCss';

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
            gap: spacePx(14),
            padding: `${spacePx(14)} 0`,
            borderTop: i > 0 ? '1px solid var(--div)' : undefined,
          }}
        >
          <div
            style={{
              width: spacePx(10),
              height: spacePx(10),
              borderRadius: '50%',
              background: entry.dotColor ?? 'var(--p500)',
              marginTop: spacePx(4),
              flexShrink: 0,
              boxShadow: entry.dotGlow !== false ? '0 0 8px rgba(var(--gl), .25)' : undefined,
            }}
          />
          <div>
            <div
              style={{
                fontSize: fontPx(11),
                color: 'var(--t4)',
              }}
            >
              {entry.time}
            </div>
            <div style={{ fontSize: fontPx(13), marginTop: spacePx(2) }}>{entry.title}</div>
            {entry.detail && (
              <div style={{ fontSize: fontPx(12), color: 'var(--t3)', marginTop: spacePx(4), lineHeight: 1.5 }}>
                {entry.detail}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
