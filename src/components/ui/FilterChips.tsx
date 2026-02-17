import React from 'react';
import { cn } from '../../utils/cn';

interface FilterChipsProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterChips({ options, value, onChange, className }: FilterChipsProps) {
  return (
    <div className={className} style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
      {options.map((opt) => (
        <button
          key={opt}
          className={cn('gi')}
          onClick={() => onChange(opt)}
          style={{
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all .15s',
            border: 'none',
            fontFamily: 'var(--font)',
            color: value === opt ? 'var(--p700)' : 'var(--t3)',
            background: value === opt ? 'rgba(var(--gl), .12)' : undefined,
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
