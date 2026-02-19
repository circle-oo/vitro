import React, { useCallback, useMemo } from 'react';
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

const WRAP_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: spacePx(6),
  flexWrap: 'wrap',
  alignItems: 'center',
};

const CHIP_BASE_STYLE: React.CSSProperties = {
  padding: `${spacePx(6)} ${spacePx(14)}`,
  borderRadius: radiusPx(10),
  fontSize: fontPx(12),
  fontWeight: 300,
  cursor: 'pointer',
  transition: 'all .15s',
  border: 'none',
  fontFamily: 'var(--font)',
};

const CHIP_INACTIVE_STYLE: React.CSSProperties = {
  ...CHIP_BASE_STYLE,
  color: 'var(--t3)',
  background: 'transparent',
};

const CHIP_ACTIVE_STYLE: React.CSSProperties = {
  ...CHIP_BASE_STYLE,
  color: 'var(--p700)',
  background: 'rgba(var(--gl), .12)',
};

function isMulti(props: FilterChipsProps): props is FilterChipsMultiProps {
  return props.multiple === true;
}

interface FilterChipButtonProps {
  option: FilterChipOption;
  active: boolean;
  onSelect: (id: string) => void;
}

const FilterChipButton = React.memo(function FilterChipButton({
  option,
  active,
  onSelect,
}: FilterChipButtonProps) {
  const onClick = useCallback(() => {
    onSelect(option.id);
  }, [onSelect, option.id]);

  return (
    <button
      className={cn('gi')}
      onClick={onClick}
      style={active ? CHIP_ACTIVE_STYLE : CHIP_INACTIVE_STYLE}
    >
      {option.label}
    </button>
  );
});

FilterChipButton.displayName = 'FilterChipButton';

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

  const onSelect = useCallback((id: string) => {
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
  }, [props.multiple, props.onChange, props.value]);

  return (
    <div className={className} style={WRAP_STYLE}>
      {normalizedOptions.map((opt) => {
        const active = selectedSet ? selectedSet.has(opt.id) : props.value === opt.id;
        return (
          <FilterChipButton
            key={opt.id}
            option={opt}
            active={active}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}
