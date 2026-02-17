import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export interface JsonViewerProps {
  data: unknown;
  collapsed?: boolean;
  className?: string;
}

function JsonValue({ value, depth }: { value: unknown; depth: number }) {
  const [open, setOpen] = useState(depth < 2);

  if (value === null) {
    return <span style={{ color: 'var(--t4)', fontStyle: 'italic' }}>null</span>;
  }
  if (typeof value === 'boolean') {
    return <span style={{ color: 'var(--wrn)' }}>{String(value)}</span>;
  }
  if (typeof value === 'number') {
    return <span style={{ color: 'var(--p500)' }}>{value}</span>;
  }
  if (typeof value === 'string') {
    return <span style={{ color: 'var(--ok)' }}>"{value}"</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span>{'[]'}</span>;
    return (
      <span>
        <span onClick={() => setOpen(!open)} style={{ cursor: 'pointer', userSelect: 'none' }}>
          {open ? '[\u2003' : `[...${value.length}]`}
        </span>
        {open && (
          <>
            {value.map((item, i) => (
              <div key={i} style={{ paddingLeft: '18px' }}>
                <JsonValue value={item} depth={depth + 1} />
                {i < value.length - 1 && ','}
              </div>
            ))}
            <span>]</span>
          </>
        )}
      </span>
    );
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span>{'{}'}</span>;
    return (
      <span>
        <span onClick={() => setOpen(!open)} style={{ cursor: 'pointer', userSelect: 'none' }}>
          {open ? '{\u2003' : `{...${entries.length}}`}
        </span>
        {open && (
          <>
            {entries.map(([key, val], i) => (
              <div key={key} style={{ paddingLeft: '18px' }}>
                <span style={{ color: 'var(--p600)' }}>"{key}"</span>
                {': '}
                <JsonValue value={val} depth={depth + 1} />
                {i < entries.length - 1 && ','}
              </div>
            ))}
            <span>{'}'}</span>
          </>
        )}
      </span>
    );
  }
  return <span>{String(value)}</span>;
}

export function JsonViewer({ data, collapsed, className }: JsonViewerProps) {
  return (
    <pre
      className={cn(className)}
      style={{
        fontFamily: 'var(--mono)',
        fontSize: '12px',
        lineHeight: 1.7,
        color: 'var(--t2)',
        margin: 0,
        padding: '16px',
        background: 'var(--gi-bg)',
        borderRadius: '12px',
        overflow: 'auto',
      }}
    >
      <JsonValue value={data} depth={collapsed ? 999 : 0} />
    </pre>
  );
}
