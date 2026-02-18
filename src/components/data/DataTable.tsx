import React, { useState, useMemo } from 'react';
import { Checkbox } from '../ui/Checkbox';

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
  className?: string;
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
  selectedKeys = new Set(),
  onSelectionChange,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortColumn = useMemo(
    () => columns.find((col) => col.key === sortKey),
    [columns, sortKey],
  );

  const rowEntries = useMemo(
    () => data.map((row) => ({ row, key: rowKey(row) })),
    [data, rowKey],
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

  const allSelected = rowEntries.length > 0 && rowEntries.every((entry) => selectedKeys.has(entry.key));

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange?.(new Set());
    } else {
      onSelectionChange?.(new Set(rowEntries.map((entry) => entry.key)));
    }
  };

  const toggleRow = (key: string) => {
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange?.(next);
  };

  return (
    <div style={{ overflowX: 'auto' }} className={className}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
        }}
      >
        <thead>
          <tr>
            {selectable && (
              <th style={{ width: '40px', padding: '12px 16px' }}>
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
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '12px',
                  fontWeight: 100,
                  textTransform: 'uppercase',
                  letterSpacing: '.6px',
                  color: 'var(--t2)',
                  borderBottom: '1px solid var(--div)',
                  cursor: col.sortable !== false ? 'pointer' : 'default',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.header}
                {sortKey === col.key && (
                  <span style={{ marginLeft: '4px', fontSize: '10px', color: 'var(--p500)' }}>
                    {sortDir === 'asc' ? '\u25B2' : '\u25BC'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map(({ row, key }) => {
            const selected = selectedKeys.has(key);
            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(row)}
                style={{
                  cursor: onRowClick ? 'pointer' : undefined,
                  background: selected ? 'rgba(var(--gl), .10)' : undefined,
                }}
              >
                {selectable && (
                  <td
                    style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox checked={selected} onChange={() => toggleRow(key)} />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--div)',
                      transition: 'background .1s',
                    }}
                  >
                    {col.render ? col.render(row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
