import React, { useMemo } from 'react';
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

const ROW_GAP = spacePx(14);
const ROW_PADDING = spacePx(14);
const DOT_SIZE = spacePx(10);
const DOT_MARGIN_TOP = spacePx(4);
const TITLE_MARGIN_TOP = spacePx(2);
const DETAIL_MARGIN_TOP = spacePx(4);

const ROW_BASE_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: ROW_GAP,
  padding: `${ROW_PADDING} 0`,
};

const ROW_WITH_BORDER_STYLE: React.CSSProperties = {
  ...ROW_BASE_STYLE,
  borderTop: '1px solid var(--div)',
};

const DOT_BASE_STYLE: React.CSSProperties = {
  width: DOT_SIZE,
  height: DOT_SIZE,
  borderRadius: '50%',
  marginTop: DOT_MARGIN_TOP,
  flexShrink: 0,
};

const TIME_STYLE: React.CSSProperties = {
  fontSize: fontPx(11),
  color: 'var(--t4)',
};

const TITLE_STYLE: React.CSSProperties = {
  fontSize: fontPx(13),
  marginTop: TITLE_MARGIN_TOP,
};

const DETAIL_STYLE: React.CSSProperties = {
  fontSize: fontPx(12),
  color: 'var(--t3)',
  marginTop: DETAIL_MARGIN_TOP,
  lineHeight: 1.5,
};

interface TimelineRowProps {
  entry: TimelineEntry;
  withBorder: boolean;
}

const TimelineRow = React.memo(function TimelineRow({ entry, withBorder }: TimelineRowProps) {
  const rowStyle = withBorder ? ROW_WITH_BORDER_STYLE : ROW_BASE_STYLE;
  const dotStyle = useMemo<React.CSSProperties>(
    () => ({
      ...DOT_BASE_STYLE,
      background: entry.dotColor ?? 'var(--p500)',
      boxShadow: entry.dotGlow !== false ? '0 0 8px rgba(var(--gl), .25)' : undefined,
    }),
    [entry.dotColor, entry.dotGlow],
  );

  return (
    <div style={rowStyle}>
      <div style={dotStyle} />
      <div>
        <div style={TIME_STYLE}>{entry.time}</div>
        <div style={TITLE_STYLE}>{entry.title}</div>
        {entry.detail && (
          <div style={DETAIL_STYLE}>
            {entry.detail}
          </div>
        )}
      </div>
    </div>
  );
});

TimelineRow.displayName = 'TimelineRow';

export function Timeline({ entries, className }: TimelineProps) {
  return (
    <div className={className}>
      {entries.map((entry, index) => (
        <TimelineRow key={index} entry={entry} withBorder={index > 0} />
      ))}
    </div>
  );
}
