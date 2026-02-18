import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks/useControllableState';
import { useDismissibleLayer } from '../../hooks/useDismissibleLayer';
import { useOverlayPosition } from './useOverlayPosition';

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

function mergeHandlers<E>(
  first?: (event: E) => void,
  second?: (event: E) => void,
) {
  return (event: E) => {
    first?.(event);
    second?.(event);
  };
}

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
      items: group.items.map((item) => ({
        item,
        index: cursor++,
      })),
    }));
  }, [resolvedGroups]);

  const enabledIndexes = useMemo(
    () => flatItems.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled).map(({ index }) => index),
    [flatItems],
  );

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
      return;
    }
    setActiveIndex(enabledIndexes[0] ?? -1);
  }, [enabledIndexes, isOpen]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    itemRefs.current[activeIndex]?.focus();
  }, [activeIndex, isOpen]);

  useDismissibleLayer({
    open: isOpen,
    refs: [rootRef, menuRef],
    onDismiss: () => setOpen(false),
  });

  const moveActive = (delta: number) => {
    if (enabledIndexes.length === 0) return;
    const currentPos = Math.max(0, enabledIndexes.indexOf(activeIndex));
    const nextPos = (currentPos + delta + enabledIndexes.length) % enabledIndexes.length;
    setActiveIndex(enabledIndexes[nextPos]);
  };

  const selectItem = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    if (closeOnSelect) setOpen(false);
  };

  const triggerNode = React.cloneElement(trigger, {
    onClick: mergeHandlers(trigger.props.onClick, () => {
      if (disabled) return;
      setOpen(!isOpen);
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

  return (
    <div ref={rootRef} className={cn(className)} style={{ position: 'relative', display: 'inline-flex' }}>
      {triggerNode}

      {isOpen && createPortal(
        <div
          ref={menuRef}
          className={cn('go', menuClassName)}
          role="menu"
          style={{
            ...overlayPosition.style,
            minWidth: Math.max(220, rootRef.current?.offsetWidth ?? 0),
            maxWidth: 'min(360px, calc(100vw - 16px))',
            padding: '6px',
            zIndex: 260,
            display: 'grid',
            gap: '2px',
          }}
          onKeyDown={(event) => {
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
            }
          }}
        >
          {indexedGroups.map((group, groupIndex) => (
            <React.Fragment key={`group-${groupIndex}`}>
              {group.label && (
                <div
                  style={{
                    padding: '6px 12px 4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                    color: 'var(--t4)',
                  }}
                >
                  {group.label}
                </div>
              )}

              {group.items.map(({ item, index }) => {
                const active = index === activeIndex;

                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onMouseEnter={() => !item.disabled && setActiveIndex(index)}
                    onFocus={() => !item.disabled && setActiveIndex(index)}
                    onClick={() => selectItem(item)}
                    style={{
                      width: '100%',
                      border: 'none',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      padding: '9px 10px',
                      borderRadius: '10px',
                      background: active ? 'rgba(var(--gl), .14)' : 'transparent',
                      color: item.disabled
                        ? 'var(--t4)'
                        : item.destructive
                          ? 'var(--err)'
                          : active
                            ? 'var(--p700)'
                            : 'var(--t2)',
                      cursor: item.disabled ? 'not-allowed' : 'pointer',
                      fontFamily: 'var(--font)',
                      fontSize: '13px',
                      lineHeight: 1.3,
                      opacity: item.disabled ? 0.6 : 1,
                      minHeight: '36px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      {item.icon && (
                        <span style={{ width: '16px', textAlign: 'center', opacity: 0.75 }}>
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </span>
                    {item.shortcut && (
                      <span style={{ fontSize: '11px', color: 'var(--t3)', whiteSpace: 'nowrap' }}>
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                );
              })}

              {groupIndex < indexedGroups.length - 1 && (
                <div
                  style={{
                    height: '1px',
                    margin: '4px 8px',
                    background: 'var(--div)',
                  }}
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
