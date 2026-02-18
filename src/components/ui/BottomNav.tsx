import React, { useMemo, useState } from 'react';
import { cn } from '../../utils/cn';

export interface BottomNavItem {
  id: string;
  label: React.ReactNode;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  fixed?: boolean;
  className?: string;
}

function firstEnabledId(items: BottomNavItem[]): string {
  return items.find((item) => !item.disabled)?.id ?? items[0]?.id ?? '';
}

export function BottomNav({
  items,
  value,
  defaultValue,
  onValueChange,
  fixed = true,
  className,
}: BottomNavProps) {
  const isControlled = value != null;
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabledId(items));
  const selected = isControlled ? value : internalValue;

  const selectedIndex = useMemo(
    () => Math.max(0, items.findIndex((item) => item.id === selected)),
    [items, selected],
  );

  const changeValue = (nextValue: string, disabled?: boolean) => {
    if (disabled) return;
    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <nav
      className={cn('go', className)}
      aria-label="Bottom navigation"
      style={{
        position: fixed ? 'fixed' : 'relative',
        left: fixed ? '50%' : undefined,
        bottom: fixed ? 'calc(10px + env(safe-area-inset-bottom, 0px))' : undefined,
        transform: fixed ? 'translateX(-50%)' : undefined,
        width: fixed
          ? 'min(640px, calc(100vw - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px) - 20px))'
          : '100%',
        zIndex: fixed ? 120 : undefined,
        padding: '6px',
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.max(1, items.length)}, minmax(0, 1fr))`,
        gap: '4px',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '6px',
          bottom: '6px',
          left: '6px',
          width: `calc((100% - 12px) / ${Math.max(1, items.length)})`,
          transform: `translateX(${selectedIndex * 100}%)`,
          transition: 'transform .24s var(--ease)',
          borderRadius: '14px',
          background: 'color-mix(in srgb, var(--gc-bg) 86%, rgba(var(--gl), .16))',
          boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--gi-bd) 75%, transparent)',
          backdropFilter: 'blur(18px) saturate(160%)',
          WebkitBackdropFilter: 'blur(18px) saturate(160%)',
          pointerEvents: 'none',
        }}
      />

      {items.map((item) => {
        const active = selected === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => changeValue(item.id, item.disabled)}
            disabled={item.disabled}
            aria-current={active ? 'page' : undefined}
            style={{
              border: 0,
              borderRadius: '12px',
              background: 'transparent',
              minHeight: '56px',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              opacity: item.disabled ? 0.5 : 1,
              color: active ? 'var(--p700)' : 'var(--t3)',
              display: 'grid',
              alignContent: 'center',
              justifyItems: 'center',
              gap: '3px',
              position: 'relative',
              zIndex: 1,
              transition: 'color .15s',
            }}
          >
            <span style={{ width: '18px', height: '18px', display: 'grid', placeItems: 'center' }}>
              {item.icon}
            </span>
            <span style={{ fontSize: '11px', fontWeight: active ? 300 : 200, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
            {item.badge != null && (
              <span
                style={{
                  position: 'absolute',
                  top: '7px',
                  right: 'max(8px, 20%)',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '999px',
                  background: 'var(--err)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 300,
                  display: 'grid',
                  placeItems: 'center',
                  padding: '0 4px',
                  lineHeight: 1,
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
