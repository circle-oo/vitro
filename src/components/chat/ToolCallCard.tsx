import React from 'react';

export interface ToolCallCardProps {
  name: string;
  result?: string;
  className?: string;
}

export function ToolCallCard({ name, result, className }: ToolCallCardProps) {
  return (
    <div
      className={className}
      style={{
        marginTop: '10px',
        padding: '12px 16px',
        borderRadius: '14px',
        fontSize: '12px',
        border: '1px solid var(--div)',
        background: 'var(--gi-bg)',
      }}
    >
      <div
        style={{
          fontWeight: 300,
          color: 'var(--p600)',
          marginBottom: result ? '6px' : 0,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ fontSize: '12px' }}>{'\u26A1'}</span>
        {name}
      </div>
      {result && (
        <div
          style={{
            fontSize: '11px',
            color: 'var(--t2)',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}
