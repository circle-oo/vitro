import React, { useMemo, useState } from 'react';
import { cn } from '../../utils/cn';

export interface SegmentedOption {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

function firstEnabledId(options: SegmentedOption[]): string {
  return options.find((option) => !option.disabled)?.id ?? options[0]?.id ?? '';
}

export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  className,
}: SegmentedControlProps) {
  const isControlled = value != null;
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabledId(options));
  const selected = isControlled ? value : internalValue;

  const selectedIndex = useMemo(
    () => Math.max(0, options.findIndex((option) => option.id === selected)),
    [options, selected],
  );
  const enabledIndexes = useMemo(
    () => options.map((option, index) => ({ option, index })).filter(({ option }) => !option.disabled).map(({ index }) => index),
    [options],
  );

  const selectValue = (nextValue: string, disabled?: boolean) => {
    if (disabled) return;
    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  const minHeight = size === 'sm' ? '34px' : '40px';
  const indicatorInset = size === 'sm' ? 3 : 4;

  return (
    <div
      className={cn('gi', className)}
      role="tablist"
      aria-orientation="horizontal"
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.max(1, options.length)}, minmax(0, 1fr))`,
        padding: `${indicatorInset}px`,
        gap: '2px',
      }}
      onKeyDown={(event) => {
        if (enabledIndexes.length === 0) return;
        const currentPos = Math.max(0, enabledIndexes.indexOf(selectedIndex));
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          const next = enabledIndexes[(currentPos + 1) % enabledIndexes.length];
          const option = options[next];
          if (option) selectValue(option.id, option.disabled);
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          const next = enabledIndexes[(currentPos - 1 + enabledIndexes.length) % enabledIndexes.length];
          const option = options[next];
          if (option) selectValue(option.id, option.disabled);
        }
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: indicatorInset,
          bottom: indicatorInset,
          left: indicatorInset,
          width: `calc((100% - ${indicatorInset * 2}px) / ${Math.max(1, options.length)})`,
          transform: `translateX(${selectedIndex * 100}%)`,
          transition: 'transform .22s var(--ease)',
          borderRadius: '11px',
          background: 'color-mix(in srgb, var(--gc-bg) 88%, rgba(var(--gl), .14))',
          boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--gi-bd) 80%, transparent)',
          backdropFilter: 'blur(14px) saturate(155%)',
          WebkitBackdropFilter: 'blur(14px) saturate(155%)',
          pointerEvents: 'none',
        }}
      />

      {options.map((option) => {
        const active = selected === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={option.disabled}
            onClick={() => selectValue(option.id, option.disabled)}
            style={{
              minHeight,
              border: 0,
              borderRadius: '10px',
              background: 'transparent',
              color: active ? 'var(--t1)' : 'var(--t3)',
              opacity: option.disabled ? 0.52 : 1,
              cursor: option.disabled ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              fontSize: size === 'sm' ? '12px' : '13px',
              fontWeight: active ? 300 : 200,
              zIndex: 1,
              transition: 'color .15s',
              whiteSpace: 'nowrap',
            }}
          >
            {option.icon && <span style={{ width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
