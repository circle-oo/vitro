import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Portal } from '../components/ui/Portal';
import { useVitroChartTheme, getTooltipStyle } from './useVitroChartTheme';

export interface HeatmapEntry {
  date: string; // ISO date string YYYY-MM-DD
  value: number;
}

export interface VitroHeatmapProps {
  /** Array of { date: 'YYYY-MM-DD', value: number } */
  data: HeatmapEntry[];
  /** Summary text shown bottom-left, e.g. "2,064 prompts in 29 active days" */
  summary?: string;
  /** Cell size in px (default 13) */
  cellSize?: number;
  /** Gap between cells in px (default 3) */
  cellGap?: number;
  className?: string;
}

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''] as const;
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toKey(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDate(raw: string): Date | null {
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (Number.isNaN(date.getTime())) return null;
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
  return date;
}

function getLevel(value: number, max: number): number {
  if (value <= 0) return 0;
  if (max <= 0) return 0;
  const ratio = value / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.50) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

export function VitroHeatmap({
  data,
  summary,
  cellSize = 13,
  cellGap = 3,
  className,
}: VitroHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const theme = useVitroChartTheme();
  const tooltipFrameRef = useRef<number | null>(null);
  const tooltipDraftRef = useRef<{ x: number; y: number; text: string } | null>(null);

  const { grid, monthLabels, maxVal } = useMemo(() => {
    if (data.length === 0) {
      return { grid: [] as { date: Date; key: string; value: number }[][], monthLabels: [] as { label: string; weekIndex: number }[], maxVal: 0 };
    }

    // Build value map
    const valueMap = new Map<string, number>();
    let maxV = 0;
    let minTimestamp = Number.POSITIVE_INFINITY;
    let maxTimestamp = Number.NEGATIVE_INFINITY;

    for (const entry of data) {
      const date = parseDate(entry.date);
      if (!date) continue;
      const key = toKey(date);
      valueMap.set(key, entry.value);
      if (entry.value > maxV) maxV = entry.value;
      const ts = date.getTime();
      if (ts < minTimestamp) minTimestamp = ts;
      if (ts > maxTimestamp) maxTimestamp = ts;
    }

    if (!Number.isFinite(minTimestamp) || !Number.isFinite(maxTimestamp)) {
      return { grid: [] as { date: Date; key: string; value: number }[][], monthLabels: [] as { label: string; weekIndex: number }[], maxVal: 0 };
    }

    // Determine date range
    const minDate = new Date(minTimestamp);
    const maxDate = new Date(maxTimestamp);

    // Align to start of week (Sunday)
    const startDate = new Date(minDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Align to end of week (Saturday)
    const endDate = new Date(maxDate);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    // Build week columns
    const weeks: { date: Date; key: string; value: number }[][] = [];
    const cursor = new Date(startDate);

    while (cursor <= endDate) {
      const week: { date: Date; key: string; value: number }[] = [];

      for (let d = 0; d < 7; d++) {
        const key = toKey(cursor);

        week.push({
          date: new Date(cursor),
          key,
          value: valueMap.get(key) ?? 0,
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    const monthMap = new Map<number, string>();
    let firstVisibleWeek = -1;

    weeks.forEach((week, weekIndex) => {
      week.forEach((cell) => {
        const isVisible = cell.date >= minDate && cell.date <= maxDate;
        if (!isVisible) return;

        if (firstVisibleWeek < 0) firstVisibleWeek = weekIndex;
        if (cell.date.getDate() === 1) {
          monthMap.set(weekIndex, MONTH_SHORT[cell.date.getMonth()]);
        }
      });
    });

    if (firstVisibleWeek >= 0 && !monthMap.has(firstVisibleWeek)) {
      monthMap.set(firstVisibleWeek, MONTH_SHORT[minDate.getMonth()]);
    }

    const rawMonthLabels = Array.from(monthMap.entries())
      .map(([weekIndex, label]) => ({ weekIndex, label }))
      .sort((a, b) => a.weekIndex - b.weekIndex);

    // Avoid unreadable overlap on very short ranges.
    const compactMonthLabels: { label: string; weekIndex: number }[] = [];
    for (const label of rawMonthLabels) {
      const prev = compactMonthLabels[compactMonthLabels.length - 1];
      if (!prev || label.weekIndex - prev.weekIndex >= 2) {
        compactMonthLabels.push(label);
      }
    }

    return { grid: weeks, monthLabels: compactMonthLabels, maxVal: maxV };
  }, [data]);

  const totalCols = grid.length;
  const labelWidth = 32;
  const gridWidth = Math.max(0, totalCols * (cellSize + cellGap) - cellGap);
  const flushTooltipDraft = useCallback(() => {
    tooltipFrameRef.current = null;
    const draft = tooltipDraftRef.current;
    setTooltip((prev) => {
      if (!draft) return prev ? null : prev;
      if (
        prev &&
        prev.x === draft.x &&
        prev.y === draft.y &&
        prev.text === draft.text
      ) {
        return prev;
      }
      return draft;
    });
  }, []);

  const scheduleTooltipFlush = useCallback(() => {
    if (tooltipFrameRef.current != null) return;
    tooltipFrameRef.current = window.requestAnimationFrame(flushTooltipDraft);
  }, [flushTooltipDraft]);

  const handleGridMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const cell = target.closest<HTMLElement>('[data-key][data-value]');
    if (!cell) {
      tooltipDraftRef.current = null;
      scheduleTooltipFlush();
      return;
    }

    const key = cell.dataset.key;
    const value = cell.dataset.value;
    if (!key || value == null) return;

    tooltipDraftRef.current = {
      x: event.clientX,
      y: event.clientY,
      text: `${value} on ${key}`,
    };
    scheduleTooltipFlush();
  }, [scheduleTooltipFlush]);

  const handleGridMouseLeave = useCallback(() => {
    if (tooltipFrameRef.current != null) {
      window.cancelAnimationFrame(tooltipFrameRef.current);
      tooltipFrameRef.current = null;
    }
    tooltipDraftRef.current = null;
    setTooltip((prev) => (prev ? null : prev));
  }, []);

  useEffect(() => () => {
    if (tooltipFrameRef.current != null) {
      window.cancelAnimationFrame(tooltipFrameRef.current);
    }
  }, []);

  const gridContent = useMemo(() => (
    <>
      {/* Month labels */}
      <div
        style={{
          display: 'flex',
          marginLeft: labelWidth + cellGap,
          marginBottom: '4px',
          position: 'relative',
          height: '16px',
          width: gridWidth,
        }}
      >
        {monthLabels.map((m, i) => (
          <span
            key={`${m.label}-${i}`}
            style={{
              position: 'absolute',
              left: m.weekIndex * (cellSize + cellGap),
              fontSize: '11px',
              color: 'var(--t4)',
              fontWeight: 200,
            }}
          >
            {m.label}
          </span>
        ))}
      </div>

      {/* Grid: 7 rows (Sun..Sat), N week columns */}
      <div
        style={{ display: 'flex', gap: `${cellGap}px` }}
        onMouseMove={handleGridMouseMove}
        onMouseLeave={handleGridMouseLeave}
      >
        {/* Day labels column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${cellGap}px`,
            width: labelWidth,
            flexShrink: 0,
          }}
        >
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              style={{
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '6px',
                fontSize: '11px',
                color: 'var(--t4)',
                fontWeight: 200,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Week columns */}
        {grid.map((week, wi) => (
          <div
            key={wi}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${cellGap}px`,
            }}
          >
            {week.map((cell) => {
              const level = getLevel(cell.value, maxVal);
              return (
                <div
                  key={cell.key}
                  className={`hmc hm${level}`}
                  style={{ width: cellSize, height: cellSize }}
                  data-key={cell.key}
                  data-value={String(cell.value)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  ), [cellGap, cellSize, grid, gridWidth, handleGridMouseLeave, handleGridMouseMove, maxVal, monthLabels]);

  return (
    <div className={className}>
      {gridContent}

      {/* Footer: summary + legend */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginTop: '10px',
          marginLeft: labelWidth + cellGap,
        }}
      >
        {summary && <span style={{ fontSize: '11px', color: 'var(--t4)' }}>{summary}</span>}
        <div className="hmleg">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} className={`hm${i}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Tooltip — portalled to body */}
      {tooltip && (
        <Portal>
          <div
            style={{
              position: 'fixed',
              zIndex: 999,
              fontFamily: 'var(--font)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              left: tooltip.x + 12,
              top: tooltip.y - 32,
              ...getTooltipStyle(theme.mode),
            }}
          >
            {tooltip.text}
          </div>
        </Portal>
      )}
    </div>
  );
}
