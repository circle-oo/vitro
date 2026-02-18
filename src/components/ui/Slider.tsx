import React, { useMemo, useState } from 'react';
import { cn } from '../../utils/cn';

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: React.ReactNode;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

export function Slider({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  showValue = true,
  formatValue,
  className,
}: SliderProps) {
  const isControlled = value != null;
  const initial = defaultValue ?? min;
  const [internalValue, setInternalValue] = useState(initial);
  const current = isControlled ? value : internalValue;

  const progress = useMemo(() => {
    const safe = Math.max(min, Math.min(max, current));
    return ((safe - min) / Math.max(1, max - min)) * 100;
  }, [current, max, min]);

  const formattedValue = formatValue ? formatValue(current) : String(current);

  return (
    <div className={cn(className)} style={{ display: 'grid', gap: '8px' }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          {label && <span style={{ fontSize: '13px', color: 'var(--t2)' }}>{label}</span>}
          {showValue && <span style={{ fontSize: '12px', color: 'var(--t3)' }}>{formattedValue}</span>}
        </div>
      )}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!isControlled) setInternalValue(next);
          onValueChange?.(next);
        }}
        style={{
          width: '100%',
          accentColor: 'var(--p500)',
          height: '18px',
          borderRadius: '999px',
          background: `linear-gradient(90deg, var(--p500) 0%, var(--p500) ${progress}%, rgba(var(--gl), .14) ${progress}%, rgba(var(--gl), .14) 100%)`,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
    </div>
  );
}
