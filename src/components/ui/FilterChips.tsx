import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { fontPx, radiusPx, spacePx } from '../../utils/scaledCss';

export interface FilterChipOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterChipsBaseProps {
  options: FilterChipOption[] | string[];
  className?: string;
}

interface FilterChipsSingleProps extends FilterChipsBaseProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
}

interface FilterChipsMultiProps extends FilterChipsBaseProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
}

export type FilterChipsProps = FilterChipsSingleProps | FilterChipsMultiProps;

function isMulti(props: FilterChipsProps): props is FilterChipsMultiProps {
  return props.multiple === true;
}

export function FilterChips(props: FilterChipsProps) {
  const { options, className } = props;
  const normalizedOptions = useMemo<FilterChipOption[]>(
    () => options.map((option) => (
      typeof option === 'string'
        ? { id: option, label: option }
        : option
    )),
    [options],
  );

  const selectedSet = isMulti(props) ? new Set(props.value) : null;

  const onSelect = (id: string) => {
    if (isMulti(props)) {
      const current = new Set(props.value);
      if (current.has(id)) {
        current.delete(id);
      } else {
        current.add(id);
      }
      props.onChange(Array.from(current));
      return;
    }

    props.onChange(id);
  };

  return (
    <div className={className} style={{ display: 'flex', gap: spacePx(6), flexWrap: 'wrap', alignItems: 'center' }}>
      {normalizedOptions.map((opt) => (
        <button
          key={opt.id}
          className={cn('gi')}
          onClick={() => onSelect(opt.id)}
          style={{
            padding: `${spacePx(6)} ${spacePx(14)}`,
            borderRadius: radiusPx(10),
            fontSize: fontPx(12),
            fontWeight: 300,
            cursor: 'pointer',
            transition: 'all .15s',
            border: 'none',
            fontFamily: 'var(--font)',
            color: selectedSet ? (selectedSet.has(opt.id) ? 'var(--p700)' : 'var(--t3)') : (props.value === opt.id ? 'var(--p700)' : 'var(--t3)'),
            background: selectedSet ? (selectedSet.has(opt.id) ? 'rgba(var(--gl), .12)' : undefined) : (props.value === opt.id ? 'rgba(var(--gl), .12)' : undefined),
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
