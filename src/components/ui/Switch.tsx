import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks/useControllableState';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  label?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

const sizeMap = {
  sm: { width: 34, height: 20, knob: 16, inset: 2 },
  md: { width: 42, height: 24, knob: 20, inset: 2 },
} as const;

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  className,
}: SwitchProps) {
  const [isOn, setIsOn] = useControllableState<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange: (next) => {
      onCheckedChange?.(next);
      onChange?.(next);
    },
  });
  const metrics = sizeMap[size];

  const knobX = useMemo(() => (
    isOn ? metrics.width - metrics.knob - metrics.inset : metrics.inset
  ), [isOn, metrics.inset, metrics.knob, metrics.width]);

  const toggle = () => {
    if (disabled) return;
    setIsOn(!isOn);
  };

  return (
    <label
      className={cn(className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggle();
          }
        }}
        className="gi"
        style={{
          width: metrics.width,
          height: metrics.height,
          borderRadius: metrics.height / 2,
          border: 'none',
          background: isOn ? 'color-mix(in srgb, var(--p500) 45%, var(--gi-bg))' : undefined,
          boxShadow: isOn ? '0 0 0 1px color-mix(in srgb, var(--p500) 45%, var(--gi-bd)) inset' : undefined,
          position: 'relative',
          transition: 'all .18s var(--ease)',
          padding: 0,
          minHeight: 'unset',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: metrics.inset,
            left: knobX,
            width: metrics.knob,
            height: metrics.knob,
            borderRadius: '50%',
            background: isOn ? 'white' : 'color-mix(in srgb, white 70%, var(--gi-bg))',
            boxShadow: '0 2px 6px rgba(0, 0, 0, .18)',
            transition: 'left .18s var(--ease), background .18s var(--ease)',
          }}
        />
      </button>

      {(label || description) && (
        <span style={{ display: 'grid', gap: '2px', minWidth: 0 }}>
          {label && <span style={{ fontSize: '13px', color: 'var(--t1)' }}>{label}</span>}
          {description && <span style={{ fontSize: '12px', color: 'var(--t3)' }}>{description}</span>}
        </span>
      )}
    </label>
  );
}

export const Toggle = Switch;
