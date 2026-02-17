import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

export interface DropdownMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
}

export interface DropdownMenuProps {
  trigger: React.ReactElement<any, any>;
  items: DropdownMenuItem[];
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

interface MenuPosition {
  top: number;
  left: number;
  minWidth: number;
  transform?: string;
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
  items,
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
  const isControlled = open != null;
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const isOpen = isControlled ? !!open : internalOpen;

  const enabledIndexes = useMemo(
    () => items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled).map(({ index }) => index),
    [items],
  );

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const updatePosition = useCallback(() => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;

    const transformX = align === 'end' ? 'translateX(-100%)' : '';
    const transformY = side === 'top' ? 'translateY(-100%)' : '';
    const transform = `${transformX} ${transformY}`.trim() || undefined;

    setPosition({
      top: side === 'bottom' ? rect.bottom + offset : rect.top - offset,
      left: align === 'end' ? rect.right : rect.left,
      minWidth: Math.max(220, Math.round(rect.width)),
      transform,
    });
  }, [align, offset, side]);

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
      setPosition(null);
      return;
    }
    updatePosition();
    setActiveIndex(enabledIndexes[0] ?? -1);
  }, [enabledIndexes, isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    itemRefs.current[activeIndex]?.focus();
  }, [activeIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    window.addEventListener('pointerdown', onPointerDown, true);
    return () => window.removeEventListener('pointerdown', onPointerDown, true);
  }, [isOpen, setOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onScrollOrResize = () => updatePosition();
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, setOpen]);

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

      {isOpen && position && createPortal(
        <div
          ref={menuRef}
          className={cn('go', menuClassName)}
          role="menu"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            transform: position.transform,
            minWidth: position.minWidth,
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
              const item = items[activeIndex];
              if (item) selectItem(item);
            }
          }}
        >
          {items.map((item, index) => {
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
                  <span style={{ fontSize: '11px', color: 'var(--t4)', fontFamily: 'var(--mono)', whiteSpace: 'nowrap' }}>
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}
