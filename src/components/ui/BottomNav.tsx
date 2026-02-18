import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { fontPx, radiusPx, spacePx, touchPx } from '../../utils/scaledCss';
import { useControllableState } from '../../hooks/useControllableState';

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
  const [selected, setSelected] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? firstEnabledId(items),
    onChange: onValueChange,
  });

  const selectedIndex = useMemo(
    () => Math.max(0, items.findIndex((item) => item.id === selected)),
    [items, selected],
  );

  const changeValue = (nextValue: string, disabled?: boolean) => {
    if (disabled) return;
    setSelected(nextValue);
  };

  return (
    <nav
      className={cn('go', className)}
      aria-label="Bottom navigation"
      style={{
        position: fixed ? 'fixed' : 'relative',
        left: fixed ? '50%' : undefined,
        bottom: fixed ? `calc(${spacePx(10)} + env(safe-area-inset-bottom, 0px))` : undefined,
        transform: fixed ? 'translateX(-50%)' : undefined,
        width: fixed
          ? `min(640px, calc(100vw - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px) - ${spacePx(20)}))`
          : '100%',
        zIndex: fixed ? 120 : undefined,
        padding: spacePx(6),
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.max(1, items.length)}, minmax(0, 1fr))`,
        gap: spacePx(4),
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: spacePx(6),
          bottom: spacePx(6),
          left: spacePx(6),
          width: `calc((100% - ${spacePx(12)}) / ${Math.max(1, items.length)})`,
          transform: `translateX(${selectedIndex * 100}%)`,
          transition: 'transform .24s var(--ease)',
          borderRadius: radiusPx(14),
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
              borderRadius: radiusPx(12),
              background: 'transparent',
              minHeight: touchPx(56),
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              opacity: item.disabled ? 0.5 : 1,
              color: active ? 'var(--p700)' : 'var(--t3)',
              display: 'grid',
              alignContent: 'center',
              justifyItems: 'center',
              gap: spacePx(3),
              position: 'relative',
              zIndex: 1,
              transition: 'color .15s',
            }}
          >
            <span style={{ width: spacePx(18), height: spacePx(18), display: 'grid', placeItems: 'center' }}>
              {item.icon}
            </span>
            <span style={{ fontSize: fontPx(11), fontWeight: active ? 300 : 200, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
            {item.badge != null && (
              <span
                style={{
                  position: 'absolute',
                  top: spacePx(7),
                  right: `max(${spacePx(8)}, 20%)`,
                  minWidth: spacePx(16),
                  height: spacePx(16),
                  borderRadius: '999px',
                  background: 'var(--err)',
                  color: 'white',
                  fontSize: fontPx(10),
                  fontWeight: 300,
                  display: 'grid',
                  placeItems: 'center',
                  padding: `0 ${spacePx(4)}`,
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
