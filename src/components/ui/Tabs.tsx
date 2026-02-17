import React from 'react';
import { cn } from '../../utils/cn';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(className)}
      style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid var(--div)',
      }}
    >
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: active ? 600 : 500,
              fontFamily: 'var(--font)',
              color: active ? 'var(--p600)' : 'var(--t3)',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${active ? 'var(--p600)' : 'transparent'}`,
              cursor: 'pointer',
              transition: 'all .15s',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
