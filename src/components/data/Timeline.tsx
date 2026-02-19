import React, { useMemo } from 'react';
import { useMotionMode } from '../../hooks/useMotionMode';
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
const ROW_INLINE_PADDING = spacePx(8);
const ROW_RADIUS = spacePx(12);
const DOT_SIZE = spacePx(10);
const DOT_MARGIN_TOP = spacePx(4);
const TITLE_MARGIN_TOP = spacePx(2);
const DETAIL_MARGIN_TOP = spacePx(4);

const ROW_BASE_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: ROW_GAP,
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
  index: number;
  motionMode: 'full' | 'lite' | 'off';
}

const TimelineRow = React.memo(function TimelineRow({
  entry,
  withBorder,
  index,
  motionMode,
}: TimelineRowProps) {
  const rowStyle = useMemo<React.CSSProperties>(() => ({
    ...ROW_BASE_STYLE,
    padding: `${ROW_PADDING} ${ROW_INLINE_PADDING}`,
    marginInline: `calc(${ROW_INLINE_PADDING} * -1)`,
    borderRadius: ROW_RADIUS,
    borderTop: withBorder ? '1px solid var(--div)' : undefined,
    transition: motionMode === 'off'
      ? 'none'
      : motionMode === 'lite'
        ? 'background .14s ease, transform .14s var(--ease)'
        : 'background .18s ease, transform .18s var(--ease)',
    animation: motionMode === 'off'
      ? 'none'
      : motionMode === 'lite'
        ? 'fi .16s var(--ease) both'
        : 'fi .24s var(--ease) both',
    animationDelay: motionMode === 'full' ? `${Math.min(index * 26, 180)}ms` : undefined,
  }), [index, motionMode, withBorder]);

  const dotStyle = useMemo<React.CSSProperties>(
    () => ({
      ...DOT_BASE_STYLE,
      background: entry.dotColor ?? 'var(--p500)',
      boxShadow: entry.dotGlow !== false ? '0 0 8px rgba(var(--gl), .25)' : undefined,
    }),
    [entry.dotColor, entry.dotGlow],
  );

  return (
    <div className="vitro-timeline-row" style={rowStyle}>
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
  const motionMode = useMotionMode();

  return (
    <div className={className}>
      {entries.map((entry, index) => (
        <TimelineRow
          key={`${entry.time}-${index}`}
          entry={entry}
          withBorder={index > 0}
          index={index}
          motionMode={motionMode}
        />
      ))}
    </div>
  );
}
