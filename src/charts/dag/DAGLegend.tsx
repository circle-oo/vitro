import React from 'react';
import type { DAGStatus } from './types';

const items: Array<{ status: DAGStatus; icon: string; label: string; color: string }> = [
  { status: 'completed', icon: '\u25CF', label: 'Completed', color: 'var(--ok)' },
  { status: 'running', icon: '\u25D0', label: 'Running', color: 'var(--warn)' },
  { status: 'pending', icon: '\u25CC', label: 'Pending', color: 'var(--t4)' },
  { status: 'failed', icon: '\u2715', label: 'Failed', color: 'var(--err)' },
  { status: 'cancelled', icon: '\u2014', label: 'Cancelled', color: 'var(--t4)' },
];

export function DAGLegend() {
  return (
    <div
      role="list"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        fontSize: '10px',
        color: 'var(--t3)',
        flexWrap: 'wrap',
      }}
    >
      {items.map((item) => (
        <span
          key={item.status}
          role="listitem"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: item.color,
          }}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </span>
      ))}
    </div>
  );
}
