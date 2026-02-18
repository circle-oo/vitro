import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { fontPx, radiusPx, spacePx } from '../../utils/scaledCss';

export interface FilterChipOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterChipsProps {
  options: FilterChipOption[] | string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterChips({ options, value, onChange, className }: FilterChipsProps) {
  const normalizedOptions = useMemo<FilterChipOption[]>(
    () => options.map((option) => (
      typeof option === 'string'
        ? { id: option, label: option }
        : option
    )),
    [options],
  );

  return (
    <div className={className} style={{ display: 'flex', gap: spacePx(6), flexWrap: 'wrap', alignItems: 'center' }}>
      {normalizedOptions.map((opt) => (
        <button
          key={opt.id}
          className={cn('gi')}
          onClick={() => onChange(opt.id)}
          style={{
            padding: `${spacePx(6)} ${spacePx(14)}`,
            borderRadius: radiusPx(10),
            fontSize: fontPx(12),
            fontWeight: 300,
            cursor: 'pointer',
            transition: 'all .15s',
            border: 'none',
            fontFamily: 'var(--font)',
            color: value === opt.id ? 'var(--p700)' : 'var(--t3)',
            background: value === opt.id ? 'rgba(var(--gl), .12)' : undefined,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
