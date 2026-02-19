import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { getVirtualWindow } from '../../utils/virtualWindow';

export interface LogColumn<T = Record<string, unknown>> {
  /** Unique key for the column */
  key: string;
  /** Header label */
  header: string;
  /** Custom render function */
  render?: (row: T) => React.ReactNode;
  /** Column width hint (e.g. '120px', '20%') */
  width?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Mono font for this column */
  mono?: boolean;
  /** Truncate / word-break behavior */
  nowrap?: boolean;
}

export interface LogFilterOption {
  /** Filter value (used for matching) */
  value: string;
  /** Display label (defaults to value) */
  label?: string;
  /** Color for matching rows / badges */
  color?: string;
}

export interface LogViewerProps<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Log entries */
  data: T[];
  /** Column definitions */
  columns: LogColumn<T>[];
  /** Field name used for level-based filtering. If set, level chips are shown. */
  levelField?: string;
  /** Available level filter options (ordered from lowest to highest severity) */
  levelOptions?: LogFilterOption[];
  /** Fields to include in text search. Defaults to all string fields. */
  searchFields?: string[];
  /** Title displayed in the header */
  title?: string;
  /** Subtitle displayed below the title */
  subtitle?: string | ((count: number) => string);
  /** Max height for the scrollable log area */
  maxHeight?: string;
  /** Enable auto-scroll to bottom on new entries */
  autoScroll?: boolean;
  /** Whether log stream is paused */
  paused?: boolean;
  /** Callback when Pause/Resume is clicked */
  onPause?: () => void;
  /** Callback when Clear is clicked */
  onClear?: () => void;
  /** Label overrides */
  labels?: {
    all?: string;
    search?: string;
    pause?: string;
    resume?: string;
    clear?: string;
    autoScroll?: string;
  };
  /** Stable row key for rendering */
  rowKey?: (row: T, index: number) => string;
  /** Max rows rendered in DOM (latest rows are kept) */
  renderLimit?: number;
  /** Enable viewport-based row windowing */
  virtualized?: boolean;
  /** Estimated row height used for virtual window calculations */
  estimatedRowHeight?: number;
  /** Extra rows rendered above and below the viewport */
  overscanRows?: number;
  className?: string;
}

const ALL_FILTER = '__all__';

interface PreparedLogRow<T extends Record<string, unknown>> {
  row: T;
  levelValue: string;
  searchText: string;
}

const DEFAULT_VIEWPORT_HEIGHT = 520;

const TABLE_STYLE: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '12px',
};

const TABLE_HEADER_CELL_STYLE: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: '10px',
  fontWeight: 300,
  textTransform: 'uppercase',
  letterSpacing: '.5px',
  color: 'var(--t3)',
  borderBottom: '1px solid var(--div)',
  whiteSpace: 'nowrap',
  position: 'sticky',
  top: 0,
  background: 'var(--bg)',
  zIndex: 2,
  boxShadow: '0 1px 0 var(--div)',
};

const TABLE_BODY_CELL_STYLE: React.CSSProperties = {
  padding: '10px 14px',
  borderBottom: '1px solid var(--div)',
};

const LEVEL_BADGE_STYLE: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 300,
  letterSpacing: '.5px',
  padding: '2px 8px',
  borderRadius: '6px',
  color: 'white',
};

const ROOT_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const HEADER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: 'wrap',
};

const HEADER_TITLE_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const HEADER_COUNT_STYLE: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 300,
  color: 'var(--t4)',
  background: 'rgba(var(--gl), .08)',
  borderRadius: '8px',
  padding: '2px 8px',
};

const HEADER_SUBTITLE_STYLE: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--t4)',
  marginTop: '2px',
};

const HEADER_ACTIONS_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: '6px',
};

const HEADER_ACTION_BUTTON_STYLE: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 300,
  fontFamily: 'var(--font)',
};

const FILTER_BAR_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 16px',
  flexWrap: 'wrap',
};

const LEVEL_FILTER_WRAP_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
};

const FILTER_BUTTON_BASE_STYLE: React.CSSProperties = {
  padding: '5px 12px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: 300,
  letterSpacing: '.3px',
  transition: 'all .15s',
};

const FILTER_BUTTON_INACTIVE_STYLE: React.CSSProperties = {
  ...FILTER_BUTTON_BASE_STYLE,
  color: 'var(--t4)',
  background: 'transparent',
};

const FILTER_BUTTON_ACTIVE_STYLE: React.CSSProperties = {
  ...FILTER_BUTTON_BASE_STYLE,
  color: 'var(--p700)',
  background: 'rgba(var(--gl), .12)',
};

const SEARCH_INPUT_STYLE: React.CSSProperties = {
  flex: 1,
  minWidth: '120px',
  padding: '7px 12px',
  borderRadius: '8px',
  border: '1px solid var(--div)',
  background: 'rgba(var(--gl), .04)',
  color: 'var(--t1)',
  fontSize: '13px',
  fontFamily: 'var(--font)',
  outline: 'none',
};

const AUTOSCROLL_LABEL_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  color: 'var(--t3)',
  cursor: 'pointer',
  userSelect: 'none',
  whiteSpace: 'nowrap',
};

const LATEST_HINT_STYLE: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '8px 12px',
  fontSize: '11px',
  color: 'var(--t4)',
};

const TABLE_SCROLL_STYLE: React.CSSProperties = {
  overflowX: 'auto',
  overflowY: 'auto',
  padding: 0,
  position: 'relative',
};

const SPACER_CELL_STYLE: React.CSSProperties = {
  padding: 0,
  border: 'none',
};

function getFilterButtonStyle(active: boolean): React.CSSProperties {
  return active ? FILTER_BUTTON_ACTIVE_STYLE : FILTER_BUTTON_INACTIVE_STYLE;
}

interface LogViewerRowProps<T extends Record<string, unknown>> {
  row: T;
  rowRenderKey: string | number;
  columns: LogColumn<T>[];
  levelField?: string;
  levelValue?: string;
  levelColor?: string;
}

const LogViewerRow = React.memo(function LogViewerRow<T extends Record<string, unknown>>({
  row,
  rowRenderKey,
  columns,
  levelField,
  levelValue,
  levelColor,
}: LogViewerRowProps<T>) {
  return (
    <tr key={rowRenderKey} className="vitro-log-row">
      {columns.map((col) => {
        const isLevelCol = levelField && col.key === levelField;
        return (
          <td
            key={col.key}
            style={{
              ...TABLE_BODY_CELL_STYLE,
              whiteSpace: col.nowrap ? 'nowrap' : undefined,
              textAlign: col.align ?? 'left',
              maxWidth: col.width,
              wordBreak: col.nowrap ? undefined : 'break-word',
              color: isLevelCol ? undefined : 'var(--t2)',
            }}
          >
            {col.render
              ? col.render(row)
              : isLevelCol
                ? (
                  <span
                    style={{
                      ...LEVEL_BADGE_STYLE,
                      background: levelColor ?? 'var(--t4)',
                    }}
                  >
                    {String(levelValue ?? '')}
                  </span>
                )
                : String(row[col.key] ?? '')}
          </td>
        );
      })}
    </tr>
  );
}) as <T extends Record<string, unknown>>(props: LogViewerRowProps<T>) => React.JSX.Element;

function parsePxHeight(maxHeight: string): number {
  const text = maxHeight.trim();
  if (!text) return DEFAULT_VIEWPORT_HEIGHT;
  if (/^\d+(\.\d+)?px$/.test(text)) return Number(text.replace('px', ''));
  if (/^\d+(\.\d+)?$/.test(text)) return Number(text);
  return DEFAULT_VIEWPORT_HEIGHT;
}

export function LogViewer<T extends Record<string, unknown> = Record<string, unknown>>({
  data,
  columns,
  levelField,
  levelOptions,
  searchFields,
  title,
  subtitle,
  maxHeight = '520px',
  autoScroll: autoScrollProp = true,
  paused = false,
  onPause,
  onClear,
  labels = {},
  rowKey,
  renderLimit = 600,
  virtualized = true,
  estimatedRowHeight = 42,
  overscanRows = 12,
  className,
}: LogViewerProps<T>) {
  const [filter, setFilter] = useState(ALL_FILTER);
  const [search, setSearch] = useState('');
  const [autoScroll, setAutoScroll] = useState(autoScrollProp);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number>(() => parsePxHeight(maxHeight));
  const scrollTopRef = useRef(0);
  const pendingScrollTopRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const debouncedSearch = useDebounce(search, 120);

  const l = {
    all: labels.all ?? 'ALL',
    search: labels.search ?? 'Search...',
    pause: labels.pause ?? 'Pause',
    resume: labels.resume ?? 'Resume',
    clear: labels.clear ?? 'Clear',
    autoScroll: labels.autoScroll ?? 'Auto-scroll',
  };

  const levelMap = useMemo(() => {
    if (!levelOptions) return new Map<string, LogFilterOption>();
    return new Map(levelOptions.map((opt) => [opt.value, opt]));
  }, [levelOptions]);

  const levelIndexMap = useMemo(() => {
    if (!levelOptions) return new Map<string, number>();
    return new Map(levelOptions.map((opt, index) => [opt.value, index]));
  }, [levelOptions]);

  const resolvedSearchFields = useMemo(
    () => searchFields ?? columns.map((column) => column.key),
    [columns, searchFields],
  );

  const normalizedQuery = debouncedSearch.trim().toLowerCase();
  const deferredQuery = useDeferredValue(normalizedQuery);
  const hasQuery = deferredQuery.length > 0;

  const preparedRows = useMemo<PreparedLogRow<T>[]>(() => {
    return data.map((row) => {
      const searchText = hasQuery
        ? resolvedSearchFields
          .map((field) => {
            const value = row[field];
            return value == null ? '' : String(value).toLowerCase();
          })
          .join('\n')
        : '';
      return {
        row,
        levelValue: levelField ? String(row[levelField] ?? '') : '',
        searchText,
      };
    });
  }, [data, hasQuery, levelField, resolvedSearchFields]);

  const filteredRows = useMemo(() => {
    let result = preparedRows;

    // Level filter: show entries at or above selected severity
    if (filter !== ALL_FILTER && levelField) {
      const minIdx = levelIndexMap.get(filter);
      if (minIdx != null && minIdx >= 0) {
        result = result.filter(({ levelValue }) => {
          const rowIdx = levelIndexMap.get(levelValue);
          return rowIdx != null && rowIdx >= minIdx;
        });
      }
    }

    // Text search
    if (hasQuery) {
      result = result.filter((entry) => entry.searchText.includes(deferredQuery));
    }

    return result;
  }, [deferredQuery, filter, hasQuery, levelField, levelIndexMap, preparedRows]);

  const visibleStartIndex = useMemo(() => {
    if (renderLimit <= 0) return 0;
    return Math.max(0, filteredRows.length - renderLimit);
  }, [filteredRows.length, renderLimit]);

  const visibleRows = useMemo(
    () => (visibleStartIndex > 0 ? filteredRows.slice(visibleStartIndex) : filteredRows),
    [filteredRows, visibleStartIndex],
  );

  const virtualizationEnabled = virtualized && visibleRows.length > 120;
  const virtualWindow = useMemo(
    () => getVirtualWindow({
      enabled: virtualizationEnabled,
      totalCount: visibleRows.length,
      viewportHeight,
      itemHeight: estimatedRowHeight,
      overscan: overscanRows,
      scrollTop,
    }),
    [estimatedRowHeight, overscanRows, scrollTop, viewportHeight, virtualizationEnabled, visibleRows.length],
  );
  const windowRows = useMemo(
    () => (virtualizationEnabled ? visibleRows.slice(virtualWindow.start, virtualWindow.end) : visibleRows),
    [virtualWindow.end, virtualWindow.start, virtualizationEnabled, visibleRows],
  );
  const topSpacerHeight = virtualWindow.topSpacerHeight;
  const bottomSpacerHeight = virtualWindow.bottomSpacerHeight;
  const columnSpan = Math.max(1, columns.length);

  useEffect(() => {
    setAutoScroll(autoScrollProp);
  }, [autoScrollProp]);

  useEffect(() => {
    const target = scrollRef.current;
    if (!target) return;

    const measure = () => {
      setViewportHeight(target.clientHeight || parsePxHeight(maxHeight));
    };

    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => measure());
      observer.observe(target);
      return () => observer.disconnect();
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
  }, [maxHeight]);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null && typeof window !== 'undefined') {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
      scrollRafRef.current = null;
      pendingScrollTopRef.current = null;
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredRows.length, visibleRows.length, autoScroll]);

  const flushScrollTop = useCallback(() => {
    scrollRafRef.current = null;
    const nextScrollTop = pendingScrollTopRef.current;
    pendingScrollTopRef.current = null;
    if (nextScrollTop == null || nextScrollTop === scrollTopRef.current) return;
    scrollTopRef.current = nextScrollTop;
    setScrollTop(nextScrollTop);
  }, []);

  const onTableScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (!virtualizationEnabled) return;
    pendingScrollTopRef.current = event.currentTarget.scrollTop;
    if (scrollRafRef.current !== null || typeof window === 'undefined') return;
    scrollRafRef.current = window.requestAnimationFrame(flushScrollTop);
  }, [flushScrollTop, virtualizationEnabled]);

  const subtitleText = typeof subtitle === 'function' ? subtitle(filteredRows.length) : subtitle;

  return (
    <div className={className} style={ROOT_STYLE}>
      {/* Header */}
      {(title || onPause || onClear) && (
        <div style={HEADER_STYLE}>
          <div>
            {title && (
              <div style={HEADER_TITLE_ROW_STYLE}>
                <span style={{ fontSize: '20px', fontWeight: 300, letterSpacing: '-.3px' }}>{title}</span>
                <span style={HEADER_COUNT_STYLE}>
                  {filteredRows.length}
                </span>
              </div>
            )}
            {subtitleText && (
              <div style={HEADER_SUBTITLE_STYLE}>{subtitleText}</div>
            )}
          </div>
          <div style={HEADER_ACTIONS_STYLE}>
            {onPause && (
              <button
                className="gi"
                onClick={onPause}
                style={HEADER_ACTION_BUTTON_STYLE}
              >
                {paused ? l.resume : l.pause}
              </button>
            )}
            {onClear && (
              <button
                className="gi"
                onClick={onClear}
                style={HEADER_ACTION_BUTTON_STYLE}
              >
                {l.clear}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div
        className="gc"
        style={FILTER_BAR_STYLE}
      >
        {levelField && levelOptions && (
          <div style={LEVEL_FILTER_WRAP_STYLE}>
            <button
              className="gi"
              onClick={() => setFilter(ALL_FILTER)}
              style={getFilterButtonStyle(filter === ALL_FILTER)}
            >
              {l.all}
            </button>
            {levelOptions.map((opt) => (
              <button
                key={opt.value}
                className="gi"
                onClick={() => setFilter(opt.value)}
                style={getFilterButtonStyle(filter === opt.value)}
              >
                {opt.label ?? opt.value}
              </button>
            ))}
          </div>
        )}
        <input
          type="text"
          placeholder={l.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={SEARCH_INPUT_STYLE}
        />
        <label style={AUTOSCROLL_LABEL_STYLE}>
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            style={{ accentColor: 'var(--p500)', width: '14px', height: '14px', minHeight: 'unset' }}
          />
          {l.autoScroll}
        </label>
      </div>

      {/* Log table */}
      {visibleStartIndex > 0 && (
        <div
          className="gc"
          style={LATEST_HINT_STYLE}
        >
          Showing latest {visibleRows.length} of {filteredRows.length} entries
        </div>
      )}
      <div
        ref={scrollRef}
        onScroll={onTableScroll}
        className="gc"
        style={{
          ...TABLE_SCROLL_STYLE,
          maxHeight,
        }}
      >
        <table
          style={TABLE_STYLE}
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    ...TABLE_HEADER_CELL_STYLE,
                    textAlign: col.align ?? 'left',
                    width: col.width,
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topSpacerHeight > 0 && (
              <tr aria-hidden="true">
                <td colSpan={columnSpan} style={{ ...SPACER_CELL_STYLE, height: `${topSpacerHeight}px` }} />
              </tr>
            )}

            {windowRows.map((entry, i) => {
              const row = entry.row;
              const absoluteIndex = visibleStartIndex + virtualWindow.start + i;
              const levelVal = levelField ? entry.levelValue : undefined;
              const levelOpt = levelVal ? levelMap.get(levelVal) : undefined;
              const renderKey = rowKey ? rowKey(row, absoluteIndex) : absoluteIndex;
              return (
                <LogViewerRow
                  key={renderKey}
                  row={row}
                  rowRenderKey={renderKey}
                  columns={columns}
                  levelField={levelField}
                  levelValue={levelVal}
                  levelColor={levelOpt?.color}
                />
              );
            })}

            {bottomSpacerHeight > 0 && (
              <tr aria-hidden="true">
                <td colSpan={columnSpan} style={{ ...SPACER_CELL_STYLE, height: `${bottomSpacerHeight}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
