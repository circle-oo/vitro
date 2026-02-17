import React from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked = false, onChange, className }: CheckboxProps) {
  return (
    <span
      className={className}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onChange?.(!checked);
      }}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          onChange?.(!checked);
        }
      }}
      style={{
        width: '18px',
        height: '18px',
        borderRadius: '6px',
        border: checked ? '2px solid var(--p500)' : '2px solid var(--t4)',
        background: checked ? 'var(--p500)' : 'transparent',
        color: checked ? 'white' : 'transparent',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all .15s',
        fontSize: '11px',
        flexShrink: 0,
      }}
    >
      {'\u2713'}
    </span>
  );
}
