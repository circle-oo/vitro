import React, { useCallback, useMemo } from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks/useControllableState';

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

const ROOT_STYLE: React.CSSProperties = {
  padding: '10px',
  display: 'grid',
  gap: '3px',
};

const NODE_WRAP_STYLE: React.CSSProperties = {
  display: 'grid',
  gap: '2px',
};

const NODE_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const NODE_CHILDREN_STYLE: React.CSSProperties = {
  display: 'grid',
  gap: '2px',
};

const TOGGLE_BUTTON_BASE_STYLE: React.CSSProperties = {
  width: '18px',
  height: '18px',
  border: 0,
  background: 'transparent',
  color: 'var(--t3)',
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
  borderRadius: '8px',
  flexShrink: 0,
};

const TOGGLE_ICON_STYLE: React.CSSProperties = {
  transition: 'transform .15s',
  fontSize: '11px',
  lineHeight: 1,
};

const ITEM_BUTTON_BASE_STYLE: React.CSSProperties = {
  border: 0,
  borderRadius: '10px',
  minHeight: '34px',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '0 10px',
  textAlign: 'left',
  fontSize: '13px',
};

const ITEM_CONTENT_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 0,
};

const ITEM_ICON_STYLE: React.CSSProperties = {
  width: '14px',
  height: '14px',
  opacity: .78,
};

const ITEM_LABEL_STYLE: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const ITEM_BADGE_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--t3)',
  whiteSpace: 'nowrap',
};

interface TreeNavNodeProps {
  item: TreeNavItem;
  depth: number;
  active: boolean;
  open: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string, disabled?: boolean) => void;
  children?: React.ReactNode;
}

const TreeNavNode = React.memo(function TreeNavNode({
  item,
  depth,
  active,
  open,
  onToggle,
  onSelect,
  children,
}: TreeNavNodeProps) {
  const hasChildren = Boolean(item.children?.length);
  const indentStyle = useMemo<React.CSSProperties>(
    () => ({ marginLeft: `${depth * 14}px` }),
    [depth],
  );
  const toggleButtonStyle = useMemo<React.CSSProperties>(
    () => ({ ...TOGGLE_BUTTON_BASE_STYLE, ...indentStyle }),
    [indentStyle],
  );
  const toggleIconStyle = useMemo<React.CSSProperties>(
    () => ({
      ...TOGGLE_ICON_STYLE,
      transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
    }),
    [open],
  );
  const spacerStyle = useMemo<React.CSSProperties>(
    () => ({ width: '18px', flexShrink: 0, ...indentStyle }),
    [indentStyle],
  );
  const itemButtonStyle = useMemo<React.CSSProperties>(
    () => ({
      ...ITEM_BUTTON_BASE_STYLE,
      background: active ? 'linear-gradient(120deg, rgba(var(--gl), .2), rgba(var(--gl), .08))' : 'transparent',
      color: active ? 'var(--p700)' : 'var(--t2)',
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      opacity: item.disabled ? 0.55 : 1,
      fontWeight: active ? 300 : 200,
    }),
    [active, item.disabled],
  );

  const onToggleClick = useCallback(() => {
    onToggle(item.id);
  }, [item.id, onToggle]);

  const onSelectClick = useCallback(() => {
    onSelect(item.id, item.disabled);
  }, [item.disabled, item.id, onSelect]);

  return (
    <div style={NODE_WRAP_STYLE}>
      <div style={NODE_ROW_STYLE}>
        {hasChildren ? (
          <button
            type="button"
            onClick={onToggleClick}
            aria-label={open ? 'Collapse node' : 'Expand node'}
            style={toggleButtonStyle}
          >
            <span
              aria-hidden="true"
              style={toggleIconStyle}
            >
              {'>'}
            </span>
          </button>
        ) : (
          <span style={spacerStyle} />
        )}

        <button
          type="button"
          onClick={onSelectClick}
          disabled={item.disabled}
          aria-current={active ? 'page' : undefined}
          style={itemButtonStyle}
        >
          <span style={ITEM_CONTENT_STYLE}>
            {item.icon && <span style={ITEM_ICON_STYLE}>{item.icon}</span>}
            <span style={ITEM_LABEL_STYLE}>{item.label}</span>
          </span>
          {item.badge != null && (
            <span style={ITEM_BADGE_STYLE}>
              {item.badge}
            </span>
          )}
        </button>
      </div>

      {hasChildren && open && (
        <div style={NODE_CHILDREN_STYLE}>
          {children}
        </div>
      )}
    </div>
  );
});

TreeNavNode.displayName = 'TreeNavNode';

function flattenIds(items: TreeNavItem[], ids: Set<string>) {
  for (const item of items) {
    ids.add(item.id);
    if (item.children && item.children.length > 0) flattenIds(item.children, ids);
  }
}

interface RenderTreeContext {
  expandedSet: Set<string>;
  selected: string;
  onToggle: (id: string) => void;
  onSelect: (id: string, disabled?: boolean) => void;
}

function renderTreeNodes(
  nodes: TreeNavItem[],
  depth: number,
  context: RenderTreeContext,
): React.ReactNode {
  return nodes.map((item) => {
    const hasChildren = Boolean(item.children?.length);
    const open = hasChildren && context.expandedSet.has(item.id);
    const active = context.selected === item.id;
    const childNodes = hasChildren && open
      ? renderTreeNodes(item.children ?? [], depth + 1, context)
      : undefined;

    return (
      <TreeNavNode
        key={item.id}
        item={item}
        depth={depth}
        active={active}
        open={Boolean(open)}
        onToggle={context.onToggle}
        onSelect={context.onSelect}
      >
        {childNodes}
      </TreeNavNode>
    );
  });
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
  const [selected, setSelected] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  });
  const [expanded, setExpanded] = useControllableState<string[]>({
    value: expandedIds,
    defaultValue: defaultExpandedIds,
    onChange: onExpandedIdsChange,
  });

  const validIdSet = useMemo(() => {
    const set = new Set<string>();
    flattenIds(items, set);
    return set;
  }, [items]);

  const expandedSet = useMemo(
    () => new Set(expanded.filter((id) => validIdSet.has(id))),
    [expanded, validIdSet],
  );

  const toggleExpanded = useCallback((id: string) => {
    setExpanded((previous) => {
      const next = new Set(previous.filter((entryId) => validIdSet.has(entryId)));
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return Array.from(next);
    });
  }, [setExpanded, validIdSet]);

  const selectItem = useCallback((id: string, disabled?: boolean) => {
    if (disabled) return;
    setSelected(id);
  }, [setSelected]);

  const renderedItems = useMemo(
    () => renderTreeNodes(items, 0, {
      expandedSet,
      selected,
      onToggle: toggleExpanded,
      onSelect: selectItem,
    }),
    [expandedSet, items, selectItem, selected, toggleExpanded],
  );

  return (
    <div className={cn('gc nh', className)} style={ROOT_STYLE}>
      {renderedItems}
    </div>
  );
}
