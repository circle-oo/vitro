import React, { useState } from 'react';
import { cn } from '../../utils/cn';

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
  name?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function RadioGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  orientation = 'vertical',
  className,
}: RadioGroupProps) {
  const isControlled = value != null;
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const selected = isControlled ? value : internalValue;

  const select = (nextValue: string) => {
    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div
      className={cn(className)}
      role="radiogroup"
      style={{
        display: orientation === 'horizontal' ? 'flex' : 'grid',
        gap: '8px',
        flexWrap: orientation === 'horizontal' ? 'wrap' : undefined,
      }}
    >
      {options.map((option, index) => {
        const checked = selected === option.value;
        const optionName = name ?? 'vitro-radio-group';
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
