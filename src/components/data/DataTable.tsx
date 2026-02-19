import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox } from '../ui/Checkbox';
import { Pagination, type PaginationProps } from '../ui/Pagination';
import { fontPx, spacePx } from '../../utils/scaledCss';
import { getVirtualWindow } from '../../utils/virtualWindow';

const EMPTY_SELECTED_KEYS = new Set<string>();
const DEFAULT_TABLE_HEIGHT = '520px';

const ROOT_STYLE: React.CSSProperties = {
  display: 'grid',
  gap: '12px',
};

const TABLE_SCROLL_BASE_STYLE: React.CSSProperties = {
  overflowX: 'auto',
  position: 'relative',
};

const TABLE_STYLE: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: fontPx(13),
};

const HEADER_SELECT_CELL_STYLE: React.CSSProperties = {
  width: spacePx(40),
  padding: `${spacePx(12)} ${spacePx(16)}`,
};

const HEADER_CELL_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: `${spacePx(12)} ${spacePx(16)}`,
  fontSize: fontPx(12),
  fontWeight: 100,
  textTransform: 'uppercase',
  letterSpacing: '.6px',
  color: 'var(--t2)',
  borderBottom: '1px solid var(--div)',
  userSelect: 'none',
  whiteSpace: 'nowrap',
};

const BODY_CELL_STYLE: React.CSSProperties = {
  padding: `${spacePx(12)} ${spacePx(16)}`,
  borderBottom: '1px solid var(--div)',
};

const PAGINATION_WRAP_STYLE: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
};

const SPACER_CELL_STYLE: React.CSSProperties = {
  padding: 0,
  border: 'none',
};

interface DataRowEntry<T extends Record<string, unknown>> {
  row: T;
  key: string;
}

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => unknown;
  sortCompare?: (a: unknown, b: unknown) => number;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  onRowClick?: (row: T) => void;
  pagination?: Pick<PaginationProps, 'page' | 'totalPages' | 'onChange'>;
  /** Optional table body max height. Enables vertical scrolling when set. */
  maxBodyHeight?: string;
  /** Enable viewport-based row windowing for large tables. */
  virtualized?: boolean;
  /** Estimated row height used for virtual window calculations. */
  estimatedRowHeight?: number;
  /** Extra rows rendered above and below the viewport. */
  overscanRows?: number;
  className?: string;
}

interface DataTableRowProps<T extends Record<string, unknown>> {
  entry: DataRowEntry<T>;
  columns: DataTableColumn<T>[];
  selected: boolean;
  selectable: boolean;
  onRowClick?: (row: T) => void;
  onToggleRow?: (key: string) => void;
}

const DataTableRow = React.memo(function DataTableRow<T extends Record<string, unknown>>({
  entry,
  columns,
  selected,
  selectable,
  onRowClick,
  onToggleRow,
}: DataTableRowProps<T>) {
  return (
    <tr
      key={entry.key}
      onClick={() => onRowClick?.(entry.row)}
      style={{
        cursor: onRowClick ? 'pointer' : undefined,
        background: selected ? 'rgba(var(--gl), .10)' : undefined,
      }}
    >
      {selectable && (
        <td
          style={BODY_CELL_STYLE}
          onClick={(event) => event.stopPropagation()}
        >
          <Checkbox checked={selected} onChange={() => onToggleRow?.(entry.key)} />
        </td>
      )}
      {columns.map((col) => (
        <td
          key={col.key}
          style={BODY_CELL_STYLE}
        >
          {col.render ? col.render(entry.row) : String(entry.row[col.key] ?? '')}
        </td>
      ))}
    </tr>
  );
}) as <T extends Record<string, unknown>>(props: DataTableRowProps<T>) => React.JSX.Element;

function parsePxHeight(rawHeight: string): number {
  const trimmed = rawHeight.trim();
  if (!trimmed) return 520;
  if (/^\d+(\.\d+)?px$/.test(trimmed)) return Number(trimmed.replace('px', ''));
  if (/^\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return 520;
}

function normalizeSortValue(value: unknown): number | string {
  if (typeof value === 'number') return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (value == null) return '';

  const text = String(value).trim();
  if (!text) return '';

  const num = Number(text);
  if (!Number.isNaN(num)) return num;

  const ts = Date.parse(text);
  if (!Number.isNaN(ts)) return ts;

  return text.toLowerCase();
}

function compareValues(a: unknown, b: unknown) {
  const left = normalizeSortValue(a);
  const right = normalizeSortValue(b);

  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left).localeCompare(String(right));
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  selectable = false,
  selectedKeys = EMPTY_SELECTED_KEYS,
  onSelectionChange,
  onRowClick,
  pagination,
  maxBodyHeight,
  virtualized = false,
  estimatedRowHeight = 44,
  overscanRows = 10,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number>(() => parsePxHeight(maxBodyHeight ?? DEFAULT_TABLE_HEIGHT));
  const scrollTopRef = useRef(0);
  const pendingScrollTopRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);

  const sortColumn = useMemo(
    () => columns.find((col) => col.key === sortKey),
    [columns, sortKey],
  );

  const rowEntries = useMemo<DataRowEntry<T>[]>(
    () => data.map((row) => ({ row, key: rowKey(row) })),
    [data, rowKey],
  );
  const rowKeys = useMemo(
    () => rowEntries.map((entry) => entry.key),
    [rowEntries],
  );

  const sortedEntries = useMemo(() => {
    if (!sortKey || !sortColumn) return rowEntries;

    const getSortValue = sortColumn.sortValue
      ? sortColumn.sortValue
      : (row: T) => row[sortKey];
    const comparator = sortColumn.sortCompare ?? compareValues;

    const sortableEntries = rowEntries.map((entry) => ({
      entry,
      sortValue: getSortValue(entry.row),
    }));

    sortableEntries.sort((left, right) => {
      const cmp = comparator(left.sortValue, right.sortValue);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return sortableEntries.map((item) => item.entry);
  }, [rowEntries, sortKey, sortDir, sortColumn]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const allSelected = useMemo(
    () => rowKeys.length > 0 && rowKeys.every((key) => selectedKeys.has(key)),
    [rowKeys, selectedKeys],
  );

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange?.(new Set());
    } else {
      onSelectionChange?.(new Set(rowKeys));
    }
  };

  const toggleRow = useCallback((key: string) => {
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange?.(next);
  }, [onSelectionChange, selectedKeys]);

  const resolvedMaxBodyHeight = maxBodyHeight ?? (virtualized ? DEFAULT_TABLE_HEIGHT : undefined);
  const shouldVirtualize = virtualized && sortedEntries.length > 120;
  const virtualWindow = useMemo(
    () => getVirtualWindow({
      enabled: shouldVirtualize,
      totalCount: sortedEntries.length,
      viewportHeight,
      itemHeight: estimatedRowHeight,
      overscan: overscanRows,
      scrollTop,
    }),
    [estimatedRowHeight, overscanRows, scrollTop, shouldVirtualize, sortedEntries.length, viewportHeight],
  );
  const windowEntries = useMemo(
    () => (shouldVirtualize ? sortedEntries.slice(virtualWindow.start, virtualWindow.end) : sortedEntries),
    [shouldVirtualize, sortedEntries, virtualWindow.end, virtualWindow.start],
  );
  const topSpacerHeight = virtualWindow.topSpacerHeight;
  const bottomSpacerHeight = virtualWindow.bottomSpacerHeight;
  const columnSpan = columns.length + (selectable ? 1 : 0);

  useEffect(() => {
    if (!shouldVirtualize) return;
    const target = scrollRef.current;
    if (!target) return;

    const measure = () => {
      setViewportHeight(target.clientHeight || parsePxHeight(resolvedMaxBodyHeight ?? DEFAULT_TABLE_HEIGHT));
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
  }, [resolvedMaxBodyHeight, shouldVirtualize]);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null && typeof window !== 'undefined') {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
      scrollRafRef.current = null;
      pendingScrollTopRef.current = null;
    };
  }, []);

  const flushScrollTop = useCallback(() => {
    scrollRafRef.current = null;
    const nextScrollTop = pendingScrollTopRef.current;
    pendingScrollTopRef.current = null;
    if (nextScrollTop == null || nextScrollTop === scrollTopRef.current) return;
    scrollTopRef.current = nextScrollTop;
    setScrollTop(nextScrollTop);
  }, []);

  const onTableScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (!shouldVirtualize) return;
    pendingScrollTopRef.current = event.currentTarget.scrollTop;
    if (scrollRafRef.current !== null || typeof window === 'undefined') return;
    scrollRafRef.current = window.requestAnimationFrame(flushScrollTop);
  }, [flushScrollTop, shouldVirtualize]);

  const tableScrollStyle = useMemo<React.CSSProperties>(
    () => ({
      ...TABLE_SCROLL_BASE_STYLE,
      overflowY: resolvedMaxBodyHeight ? 'auto' : undefined,
      maxHeight: resolvedMaxBodyHeight,
    }),
    [resolvedMaxBodyHeight],
  );

  return (
    <div style={ROOT_STYLE} className={className}>
      <div ref={scrollRef} style={tableScrollStyle} onScroll={onTableScroll}>
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              {selectable && (
                <th style={HEADER_SELECT_CELL_STYLE}>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={allSelected} onChange={toggleAll} />
                  </div>
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && toggleSort(col.key)}
                  aria-sort={
                    col.sortable === false
                      ? undefined
                      : sortKey === col.key
                        ? (sortDir === 'asc' ? 'ascending' : 'descending')
                        : 'none'
                  }
                  style={{
                    ...HEADER_CELL_STYLE,
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                  }}
                >
                  {col.header}
                  {sortKey === col.key && (
                    <span style={{ marginLeft: spacePx(4), fontSize: fontPx(10), color: 'var(--p500)' }}>
                      {sortDir === 'asc' ? '\u25B2' : '\u25BC'}
                    </span>
                  )}
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

            {windowEntries.map((entry) => (
              <DataTableRow
                key={entry.key}
                entry={entry}
                columns={columns}
                selected={selectedKeys.has(entry.key)}
                selectable={selectable}
                onRowClick={onRowClick}
                onToggleRow={toggleRow}
              />
            ))}

            {bottomSpacerHeight > 0 && (
              <tr aria-hidden="true">
                <td colSpan={columnSpan} style={{ ...SPACER_CELL_STYLE, height: `${bottomSpacerHeight}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div style={PAGINATION_WRAP_STYLE}>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onChange={pagination.onChange}
          />
        </div>
      )}
    </div>
  );
}
