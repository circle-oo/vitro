import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks/useControllableState';
import { useDismissibleLayer } from '../../hooks/useDismissibleLayer';
import { useOverlayPosition } from './useOverlayPosition';
import { mergeHandlers } from '../../utils/events';

export interface DropdownMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
}

export interface DropdownMenuGroup {
  label?: React.ReactNode;
  items: DropdownMenuItem[];
}

export interface DropdownMenuProps {
  trigger: React.ReactElement<any, any>;
  items?: DropdownMenuItem[];
  groups?: DropdownMenuGroup[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'end';
  side?: 'bottom' | 'top';
  offset?: number;
  closeOnSelect?: boolean;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
}

const ROOT_STYLE: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
};

const MENU_BASE_STYLE: React.CSSProperties = {
  maxWidth: 'min(360px, calc(100vw - 16px))',
  padding: '6px',
  zIndex: 260,
  display: 'grid',
  gap: '2px',
};

const GROUP_LABEL_STYLE: React.CSSProperties = {
  padding: '6px 12px 4px',
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '.08em',
  color: 'var(--t4)',
};

const GROUP_SEPARATOR_STYLE: React.CSSProperties = {
  height: '1px',
  margin: '4px 8px',
  background: 'var(--div)',
};

const ITEM_BASE_STYLE: React.CSSProperties = {
  width: '100%',
  border: 'none',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
  padding: '9px 10px',
  borderRadius: '10px',
  fontFamily: 'var(--font)',
  fontSize: '13px',
  lineHeight: 1.3,
  minHeight: '36px',
  whiteSpace: 'nowrap',
};

const ITEM_DEFAULT_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  background: 'transparent',
  color: 'var(--t2)',
  cursor: 'pointer',
  opacity: 1,
};

const ITEM_ACTIVE_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  background: 'rgba(var(--gl), .14)',
  color: 'var(--p700)',
  cursor: 'pointer',
  opacity: 1,
};

const ITEM_DESTRUCTIVE_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  background: 'transparent',
  color: 'var(--err)',
  cursor: 'pointer',
  opacity: 1,
};

const ITEM_DESTRUCTIVE_ACTIVE_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  background: 'rgba(var(--gl), .14)',
  color: 'var(--err)',
  cursor: 'pointer',
  opacity: 1,
};

const ITEM_DISABLED_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  background: 'transparent',
  color: 'var(--t4)',
  cursor: 'not-allowed',
  opacity: 0.6,
};

const ITEM_DISABLED_ACTIVE_STYLE: React.CSSProperties = {
  ...ITEM_BASE_STYLE,
  background: 'rgba(var(--gl), .14)',
  color: 'var(--t4)',
  cursor: 'not-allowed',
  opacity: 0.6,
};

const ITEM_TEXT_WRAP_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  minWidth: 0,
};

const ITEM_ICON_STYLE: React.CSSProperties = {
  width: '16px',
  textAlign: 'center',
  opacity: 0.75,
};

const ITEM_SHORTCUT_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--t3)',
  whiteSpace: 'nowrap',
};

interface IndexedMenuItem {
  item: DropdownMenuItem;
  index: number;
}

function getItemStyle(item: DropdownMenuItem, active: boolean): React.CSSProperties {
  if (item.disabled) return active ? ITEM_DISABLED_ACTIVE_STYLE : ITEM_DISABLED_STYLE;
  if (item.destructive) return active ? ITEM_DESTRUCTIVE_ACTIVE_STYLE : ITEM_DESTRUCTIVE_STYLE;
  return active ? ITEM_ACTIVE_STYLE : ITEM_DEFAULT_STYLE;
}

interface DropdownMenuRowProps {
  indexedItem: IndexedMenuItem;
  active: boolean;
  onSetActiveIndex: (index: number) => void;
  onSelectItem: (item: DropdownMenuItem) => void;
  onSetItemRef: (index: number, element: HTMLButtonElement | null) => void;
}

const DropdownMenuRow = React.memo(function DropdownMenuRow({
  indexedItem,
  active,
  onSetActiveIndex,
  onSelectItem,
  onSetItemRef,
}: DropdownMenuRowProps) {
  const { item, index } = indexedItem;

  return (
    <button
      ref={(element) => {
        onSetItemRef(index, element);
      }}
      type="button"
      role="menuitem"
      disabled={item.disabled}
      onMouseEnter={() => !item.disabled && onSetActiveIndex(index)}
      onFocus={() => !item.disabled && onSetActiveIndex(index)}
      onClick={() => onSelectItem(item)}
      style={getItemStyle(item, active)}
    >
      <span style={ITEM_TEXT_WRAP_STYLE}>
        {item.icon && (
          <span style={ITEM_ICON_STYLE}>
            {item.icon}
          </span>
        )}
        <span>{item.label}</span>
      </span>
      {item.shortcut && (
        <span style={ITEM_SHORTCUT_STYLE}>
          {item.shortcut}
        </span>
      )}
    </button>
  );
});

DropdownMenuRow.displayName = 'DropdownMenuRow';

export function DropdownMenu({
  trigger,
  items = [],
  groups,
  open,
  onOpenChange,
  align = 'end',
  side = 'bottom',
  offset = 8,
  closeOnSelect = true,
  disabled = false,
  className,
  menuClassName,
}: DropdownMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isOpen, setOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: false,
    onChange: onOpenChange,
  });
  const [activeIndex, setActiveIndex] = useState(-1);
  const overlayPosition = useOverlayPosition({
    triggerRef: rootRef,
    overlayRef: menuRef,
    side,
    align,
    offset,
    enabled: isOpen && !disabled,
  });

  const resolvedGroups = useMemo<DropdownMenuGroup[]>(() => {
    if (groups && groups.length > 0) return groups;
    if (items.length === 0) return [];
    return [{ items }];
  }, [groups, items]);

  const flatItems = useMemo(
    () => resolvedGroups.flatMap((group) => group.items),
    [resolvedGroups],
  );

  const indexedGroups = useMemo(() => {
    let cursor = 0;
    return resolvedGroups.map((group) => ({
      label: group.label,
      items: group.items.map<IndexedMenuItem>((item) => ({
        item,
        index: cursor++,
      })),
    }));
  }, [resolvedGroups]);

  const enabledIndexes = useMemo(() => {
    const indexes: number[] = [];
    for (let index = 0; index < flatItems.length; index += 1) {
      if (!flatItems[index]?.disabled) indexes.push(index);
    }
    return indexes;
  }, [flatItems]);

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
      return;
    }
    setActiveIndex((previous) => {
      if (enabledIndexes.length === 0) return -1;
      if (enabledIndexes.includes(previous)) return previous;
      return enabledIndexes[0] ?? -1;
    });
    itemRefs.current.length = flatItems.length;
  }, [enabledIndexes, flatItems.length, isOpen]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    itemRefs.current[activeIndex]?.focus();
  }, [activeIndex, isOpen]);

  useDismissibleLayer({
    open: isOpen,
    refs: [rootRef, menuRef],
    onDismiss: () => setOpen(false),
  });

  const setItemRef = useCallback((index: number, element: HTMLButtonElement | null) => {
    itemRefs.current[index] = element;
  }, []);

  const moveActive = useCallback((delta: number) => {
    if (enabledIndexes.length === 0) return;
    setActiveIndex((previous) => {
      const currentPos = enabledIndexes.indexOf(previous);
      const startPos = currentPos >= 0 ? currentPos : 0;
      const nextPos = (startPos + delta + enabledIndexes.length) % enabledIndexes.length;
      return enabledIndexes[nextPos] ?? previous;
    });
  }, [enabledIndexes]);

  const selectItem = useCallback((item: DropdownMenuItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    if (closeOnSelect) setOpen(false);
  }, [closeOnSelect, setOpen]);

  const triggerNode = React.cloneElement(trigger, {
    onClick: mergeHandlers(trigger.props.onClick, () => {
      if (disabled) return;
      setOpen((previous) => !previous);
    }),
    onKeyDown: mergeHandlers(trigger.props.onKeyDown, (event: React.KeyboardEvent) => {
      if (disabled) return;
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setOpen(true);
      }
    }),
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
  });

  const menuStyle = useMemo<React.CSSProperties>(
    () => ({
      ...overlayPosition.style,
      ...MENU_BASE_STYLE,
      minWidth: Math.max(220, rootRef.current?.offsetWidth ?? 0),
    }),
    [overlayPosition.style],
  );

  const onMenuKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(-1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(enabledIndexes[0] ?? -1);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
      return;
    }
    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      const item = flatItems[activeIndex];
      if (item) selectItem(item);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  }, [activeIndex, enabledIndexes, flatItems, moveActive, selectItem, setOpen]);

  return (
    <div ref={rootRef} className={cn(className)} style={ROOT_STYLE}>
      {triggerNode}

      {isOpen && createPortal(
        <div
          ref={menuRef}
          className={cn('go', menuClassName)}
          role="menu"
          style={menuStyle}
          onKeyDown={onMenuKeyDown}
        >
          {indexedGroups.map((group, groupIndex) => (
            <React.Fragment key={`group-${groupIndex}`}>
              {group.label && (
                <div
                  style={GROUP_LABEL_STYLE}
                >
                  {group.label}
                </div>
              )}

              {group.items.map((indexedItem) => {
                const { item, index } = indexedItem;
                return (
                  <DropdownMenuRow
                    key={item.id}
                    indexedItem={indexedItem}
                    active={index === activeIndex}
                    onSetActiveIndex={setActiveIndex}
                    onSelectItem={selectItem}
                    onSetItemRef={setItemRef}
                  />
                );
              })}

              {groupIndex < indexedGroups.length - 1 && (
                <div
                  style={GROUP_SEPARATOR_STYLE}
                />
              )}
            </React.Fragment>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}
