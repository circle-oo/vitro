import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

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
  className?: string;
}

const ALL_FILTER = '__all__';

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
  className,
}: LogViewerProps<T>) {
  const [filter, setFilter] = useState(ALL_FILTER);
  const [search, setSearch] = useState('');
  const [autoScroll, setAutoScroll] = useState(autoScrollProp);
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const filtered = useMemo(() => {
    let result = data;

    // Level filter: show entries at or above selected severity
    if (filter !== ALL_FILTER && levelField) {
      const minIdx = levelIndexMap.get(filter);
      if (minIdx != null && minIdx >= 0) {
        result = result.filter((row) => {
          const rowLevel = String(row[levelField] ?? '');
          const rowIdx = levelIndexMap.get(rowLevel);
          return rowIdx != null && rowIdx >= minIdx;
        });
      }
    }

    // Text search
    if (normalizedQuery) {
      result = result.filter((row) =>
        resolvedSearchFields.some((f) => {
          const val = row[f];
          return val != null && String(val).toLowerCase().includes(normalizedQuery);
        })
      );
    }
    return result;
  }, [data, filter, levelField, levelIndexMap, normalizedQuery, resolvedSearchFields]);

  useEffect(() => {
    setAutoScroll(autoScrollProp);
  }, [autoScrollProp]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filtered.length, autoScroll]);

  const subtitleText = typeof subtitle === 'function' ? subtitle(filtered.length) : subtitle;

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header */}
      {(title || onPause || onClear) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            {title && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px', fontWeight: 300, letterSpacing: '-.3px' }}>{title}</span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 300,
                    color: 'var(--t4)',
                    background: 'rgba(var(--gl), .08)',
                    borderRadius: '8px',
                    padding: '2px 8px',
                  }}
                >
                  {filtered.length}
                </span>
              </div>
            )}
            {subtitleText && (
              <div style={{ fontSize: '12px', color: 'var(--t4)', marginTop: '2px' }}>{subtitleText}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {onPause && (
              <button
                className="gi"
                onClick={onPause}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 300,
                  fontFamily: 'var(--font)',
                }}
              >
                {paused ? l.resume : l.pause}
              </button>
            )}
            {onClear && (
              <button
                className="gi"
                onClick={onClear}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 300,
                  fontFamily: 'var(--font)',
                }}
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
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          flexWrap: 'wrap',
        }}
      >
        {levelField && levelOptions && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className="gi"
              onClick={() => setFilter(ALL_FILTER)}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 300,
                letterSpacing: '.3px',
                color: filter === ALL_FILTER ? 'var(--p700)' : 'var(--t4)',
                background: filter === ALL_FILTER ? 'rgba(var(--gl), .12)' : 'transparent',
                transition: 'all .15s',
              }}
            >
              {l.all}
            </button>
            {levelOptions.map((opt) => (
              <button
                key={opt.value}
                className="gi"
                onClick={() => setFilter(opt.value)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 300,
                  letterSpacing: '.3px',
                  color: filter === opt.value ? 'var(--p700)' : 'var(--t4)',
                  background: filter === opt.value ? 'rgba(var(--gl), .12)' : 'transparent',
                  transition: 'all .15s',
                }}
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
          style={{
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
          }}
        />
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--t3)',
            cursor: 'pointer',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
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
      <div
        ref={scrollRef}
        className="gc"
        style={{
          overflowX: 'auto',
          overflowY: 'auto',
          maxHeight,
          padding: 0,
          position: 'relative',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
          }}
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    textAlign: col.align ?? 'left',
                    padding: '10px 14px',
                    fontSize: '10px',
                    fontWeight: 300,
                    textTransform: 'uppercase',
                    letterSpacing: '.5px',
                    color: 'var(--t3)',
                    borderBottom: '1px solid var(--div)',
                    whiteSpace: 'nowrap',
                    width: col.width,
                    position: 'sticky',
                    top: 0,
                    background: 'var(--bg)',
                    zIndex: 2,
                    boxShadow: '0 1px 0 var(--div)',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => {
              const levelVal = levelField ? String(row[levelField] ?? '') : undefined;
              const levelOpt = levelVal ? levelMap.get(levelVal) : undefined;
              const renderKey = rowKey ? rowKey(row, i) : i;
              return (
                <tr
                  key={renderKey}
                  className="vitro-log-row"
                >
                  {columns.map((col) => {
                    const isLevelCol = levelField && col.key === levelField;
                    return (
                      <td
                        key={col.key}
                        style={{
                          padding: '10px 14px',
                          borderBottom: '1px solid var(--div)',
                          
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
                                  fontSize: '10px',
                                  fontWeight: 300,
                                  letterSpacing: '.5px',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  color: 'white',
                                  background: levelOpt?.color ?? 'var(--t4)',
                                }}
                              >
                                {String(row[col.key] ?? '')}
                              </span>
                            )
                            : String(row[col.key] ?? '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
