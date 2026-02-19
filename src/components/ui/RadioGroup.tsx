import React from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks/useControllableState';
import { useSafeId } from '../../hooks/useSafeId';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (value: string) => void;
  name?: string;
  orientation?: 'horizontal' | 'vertical';
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export function RadioGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  onChange,
  name,
  orientation = 'vertical',
  direction,
  className,
}: RadioGroupProps) {
  const generatedName = useSafeId();
  const resolvedOrientation = direction ?? orientation;
  const optionName = name ?? `vitro-radio-${generatedName}`;
  const [selected, setSelected] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? '',
    onChange: (nextValue) => {
      onValueChange?.(nextValue);
      onChange?.(nextValue);
    },
  });

  const select = (nextValue: string) => {
    setSelected(nextValue);
  };

  return (
    <div
      className={cn(className)}
      role="radiogroup"
      style={{
        display: resolvedOrientation === 'horizontal' ? 'flex' : 'grid',
        gap: '8px',
        flexWrap: resolvedOrientation === 'horizontal' ? 'wrap' : undefined,
      }}
    >
      {options.map((option, index) => {
        const checked = selected === option.value;
        return (
          <label
            key={option.value}
            className="gi"
            style={{
              display: 'inline-flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px 12px',
              cursor: option.disabled ? 'not-allowed' : 'pointer',
              opacity: option.disabled ? 0.6 : 1,
              minWidth: 0,
            }}
          >
            <input
              type="radio"
              name={optionName}
              value={option.value}
              checked={checked}
              disabled={option.disabled}
              onChange={() => select(option.value)}
              style={{
                appearance: 'none',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: `2px solid ${checked ? 'var(--p500)' : 'var(--t4)'}`,
                boxShadow: checked ? 'inset 0 0 0 4px var(--p500)' : 'none',
                marginTop: '1px',
                flexShrink: 0,
              }}
              aria-posinset={index + 1}
              aria-setsize={options.length}
            />
            <span style={{ display: 'grid', gap: '2px', minWidth: 0 }}>
              <span style={{ fontSize: '13px', color: 'var(--t1)' }}>{option.label}</span>
              {option.description && (
                <span style={{ fontSize: '12px', color: 'var(--t3)' }}>{option.description}</span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
