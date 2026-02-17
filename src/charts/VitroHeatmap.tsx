import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useVitroChartTheme, getTooltipStyle } from './useVitroChartTheme';

interface HeatmapEntry {
  date: string; // ISO date string YYYY-MM-DD
  value: number;
}

interface VitroHeatmapProps {
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
  return d.toISOString().slice(0, 10);
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

  const { grid, monthLabels, maxVal } = useMemo(() => {
    // Build value map
    const valueMap = new Map<string, number>();
    let maxV = 0;
    for (const entry of data) {
      valueMap.set(entry.date, entry.value);
      if (entry.value > maxV) maxV = entry.value;
    }

    // Determine date range
    const dates = data.map((d) => new Date(d.date + 'T00:00:00'));
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // Align to start of week (Sunday)
    const startDate = new Date(minDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Align to end of week (Saturday)
    const endDate = new Date(maxDate);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    // Build week columns
    const weeks: { date: Date; key: string; value: number }[][] = [];
    const months: { label: string; weekIndex: number }[] = [];
    let prevMonth = -1;
    const cursor = new Date(startDate);

    while (cursor <= endDate) {
      const week: { date: Date; key: string; value: number }[] = [];
      const weekIdx = weeks.length;

      for (let d = 0; d < 7; d++) {
        const key = toKey(cursor);
        const month = cursor.getMonth();

        // Track month boundaries (at the start of a week)
        if (d === 0 && month !== prevMonth) {
          months.push({ label: MONTH_SHORT[month], weekIndex: weekIdx });
          prevMonth = month;
        }

        week.push({
          date: new Date(cursor),
          key,
          value: valueMap.get(key) ?? 0,
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    return { grid: weeks, monthLabels: months, maxVal: maxV };
  }, [data]);

  const totalCols = grid.length;
  const labelWidth = 32;
  const gridWidth = totalCols * (cellSize + cellGap) - cellGap;

  return (
    <div className={className}>
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
              fontWeight: 500,
            }}
          >
            {m.label}
          </span>
        ))}
      </div>

      {/* Grid: 7 rows (Sun..Sat), N week columns */}
      <div style={{ display: 'flex', gap: `${cellGap}px` }}>
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
                fontWeight: 500,
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
                  onMouseEnter={(e) =>
                    setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      text: `${cell.value} on ${cell.key}`,
                    })
                  }
                  onMouseMove={(e) =>
                    setTooltip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : null))
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer: summary + legend */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
          marginLeft: labelWidth + cellGap,
        }}
      >
        {summary ? (
          <span style={{ fontSize: '11px', color: 'var(--t4)' }}>{summary}</span>
        ) : (
          <span />
        )}
        <div className="hmleg">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} className={`hm${i}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Tooltip — portalled to body */}
      {tooltip &&
        createPortal(
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
          </div>,
          document.body,
        )}
    </div>
  );
}
