import React, { useMemo, useState } from 'react';
import { cn } from '../../utils/cn';

export interface TreeNavItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  children?: TreeNavItem[];
}

export interface TreeNavProps {
  items: TreeNavItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedIdsChange?: (ids: string[]) => void;
  className?: string;
}

function flattenIds(items: TreeNavItem[], ids: Set<string>) {
  for (const item of items) {
    ids.add(item.id);
    if (item.children && item.children.length > 0) flattenIds(item.children, ids);
  }
}

export function TreeNav({
  items,
  value,
  defaultValue,
  onValueChange,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedIdsChange,
  className,
}: TreeNavProps) {
  const isValueControlled = value != null;
  const isExpandedControlled = expandedIds != null;
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpandedIds);
  const selected = isValueControlled ? value : internalValue;
  const expanded = isExpandedControlled ? expandedIds : internalExpanded;

  const validIdSet = useMemo(() => {
    const set = new Set<string>();
    flattenIds(items, set);
    return set;
  }, [items]);

  const expandedSet = useMemo(
    () => new Set(expanded.filter((id) => validIdSet.has(id))),
    [expanded, validIdSet],
  );

  const setExpanded = (next: string[]) => {
    if (!isExpandedControlled) setInternalExpanded(next);
    onExpandedIdsChange?.(next);
  };

  const toggleExpanded = (id: string) => {
    const next = new Set(expandedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(Array.from(next));
  };

  const selectItem = (id: string, disabled?: boolean) => {
    if (disabled) return;
    if (!isValueControlled) setInternalValue(id);
    onValueChange?.(id);
  };

  const renderItems = (nodes: TreeNavItem[], depth: number): React.ReactNode => nodes.map((item) => {
    const hasChildren = !!item.children?.length;
    const open = hasChildren && expandedSet.has(item.id);
    const active = selected === item.id;

    return (
      <div key={item.id} style={{ display: 'grid', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleExpanded(item.id)}
              aria-label={open ? 'Collapse node' : 'Expand node'}
              style={{
                width: '18px',
                height: '18px',
                border: 0,
                background: 'transparent',
                color: 'var(--t3)',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '8px',
                marginLeft: `${depth * 14}px`,
                flexShrink: 0,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform .15s',
                  fontSize: '11px',
                  lineHeight: 1,
                }}
              >
                {'>'}
              </span>
            </button>
          ) : (
            <span style={{ width: '18px', marginLeft: `${depth * 14}px`, flexShrink: 0 }} />
          )}

          <button
            type="button"
            onClick={() => selectItem(item.id, item.disabled)}
            disabled={item.disabled}
            aria-current={active ? 'page' : undefined}
            style={{
              border: 0,
              borderRadius: '10px',
              minHeight: '34px',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '0 10px',
              background: active ? 'linear-gradient(120deg, rgba(var(--gl), .2), rgba(var(--gl), .08))' : 'transparent',
              color: active ? 'var(--p700)' : 'var(--t2)',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              opacity: item.disabled ? 0.55 : 1,
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: active ? 300 : 200,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              {item.icon && <span style={{ width: '14px', height: '14px', opacity: .78 }}>{item.icon}</span>}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
            </span>
            {item.badge != null && (
              <span style={{ fontSize: '11px', color: 'var(--t3)', whiteSpace: 'nowrap' }}>
                {item.badge}
              </span>
            )}
          </button>
        </div>

        {hasChildren && open && (
          <div style={{ display: 'grid', gap: '2px' }}>
            {renderItems(item.children ?? [], depth + 1)}
          </div>
        )}
      </div>
    );
  });

  return (
    <div className={cn('gc nh', className)} style={{ padding: '10px', display: 'grid', gap: '3px' }}>
      {renderItems(items, 0)}
    </div>
  );
}
