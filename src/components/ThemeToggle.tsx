import React from 'react';

export interface ThemeToggleProps {
  mode: 'light' | 'dark';
  onToggle: () => void;
  className?: string;
}

export function ThemeToggle({ mode, onToggle, className }: ThemeToggleProps) {
  return (
    <button
      className={`gi ${className ?? ''}`}
      onClick={onToggle}
      aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '14px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all .15s',
      }}
    >
      {mode === 'light' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
    </button>
  );
}
