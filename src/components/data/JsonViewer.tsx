import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '../../utils/cn';

export interface JsonViewerProps {
  data: unknown;
  collapsed?: boolean;
  className?: string;
}

const ROOT_PATH = '$';
const DEFAULT_EXPANDED_DEPTH = 2;

const PRE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: '12px',
  lineHeight: 1.7,
  color: 'var(--t2)',
  margin: 0,
  padding: '16px',
  background: 'var(--gi-bg)',
  borderRadius: '12px',
  overflow: 'auto',
};

const NULL_STYLE: React.CSSProperties = {
  color: 'var(--t4)',
  fontStyle: 'italic',
};

const BOOLEAN_STYLE: React.CSSProperties = {
  color: 'var(--wrn)',
};

const NUMBER_STYLE: React.CSSProperties = {
  color: 'var(--p500)',
};

const STRING_STYLE: React.CSSProperties = {
  color: 'var(--ok)',
};

const KEY_STYLE: React.CSSProperties = {
  color: 'var(--p600)',
};

const TOGGLE_STYLE: React.CSSProperties = {
  cursor: 'pointer',
  userSelect: 'none',
};

const CHILD_ROW_STYLE: React.CSSProperties = {
  paddingLeft: '18px',
};

function encodePathSegment(segment: string): string {
  return encodeURIComponent(segment);
}

function isExpandable(value: unknown): value is unknown[] | Record<string, unknown> {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.keys(value as Record<string, unknown>).length > 0;
  return false;
}

function collectDefaultOpenPaths(
  value: unknown,
  depth: number,
  maxDepth: number,
  path: string,
  expanded: Set<string>,
) {
  if (depth >= maxDepth || !isExpandable(value)) return;

  expanded.add(path);

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectDefaultOpenPaths(item, depth + 1, maxDepth, `${path}/${index}`, expanded);
    });
    return;
  }

  Object.entries(value).forEach(([key, item]) => {
    collectDefaultOpenPaths(item, depth + 1, maxDepth, `${path}/${encodePathSegment(key)}`, expanded);
  });
}

function createDefaultOpenPaths(data: unknown, collapsed?: boolean): Set<string> {
  const expanded = new Set<string>();
  const maxDepth = collapsed ? 0 : DEFAULT_EXPANDED_DEPTH;
  collectDefaultOpenPaths(data, 0, maxDepth, ROOT_PATH, expanded);
  return expanded;
}

interface JsonValueProps {
  value: unknown;
  path: string;
  openPaths: Set<string>;
  changedPath: string;
  onTogglePath: (path: string) => void;
}

function isPathAffected(path: string, changedPath: string): boolean {
  if (changedPath === ROOT_PATH) return true;
  return (
    changedPath === path
    || changedPath.startsWith(`${path}/`)
    || path.startsWith(`${changedPath}/`)
  );
}

const JsonValue = React.memo(function JsonValue({
  value,
  path,
  openPaths,
  changedPath,
  onTogglePath,
}: JsonValueProps) {
  if (value === null) {
    return <span style={NULL_STYLE}>null</span>;
  }

  if (typeof value === 'boolean') {
    return <span style={BOOLEAN_STYLE}>{String(value)}</span>;
  }

  if (typeof value === 'number') {
    return <span style={NUMBER_STYLE}>{value}</span>;
  }

  if (typeof value === 'string') {
    return <span style={STRING_STYLE}>"{value}"</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span>{'[]'}</span>;
    const open = openPaths.has(path);

    return (
      <span>
        <span onClick={() => onTogglePath(path)} style={TOGGLE_STYLE}>
          {open ? '[\u2003' : `[...${value.length}]`}
        </span>
        {open && (
          <>
            {value.map((item, index) => {
              const childPath = `${path}/${index}`;
              return (
                <div key={childPath} style={CHILD_ROW_STYLE}>
                  <JsonValue
                    value={item}
                    path={childPath}
                    openPaths={openPaths}
                    changedPath={changedPath}
                    onTogglePath={onTogglePath}
                  />
                  {index < value.length - 1 && ','}
                </div>
              );
            })}
            <span>]</span>
          </>
        )}
      </span>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span>{'{}'}</span>;
    const open = openPaths.has(path);

    return (
      <span>
        <span onClick={() => onTogglePath(path)} style={TOGGLE_STYLE}>
          {open ? '{\u2003' : `{...${entries.length}}`}
        </span>
        {open && (
          <>
            {entries.map(([key, entryValue], index) => {
              const childPath = `${path}/${encodePathSegment(key)}`;
              return (
                <div key={childPath} style={CHILD_ROW_STYLE}>
                  <span style={KEY_STYLE}>"{key}"</span>
                  {': '}
                  <JsonValue
                    value={entryValue}
                    path={childPath}
                    openPaths={openPaths}
                    changedPath={changedPath}
                    onTogglePath={onTogglePath}
                  />
                  {index < entries.length - 1 && ','}
                </div>
              );
            })}
            <span>{'}'}</span>
          </>
        )}
      </span>
    );
  }

  return <span>{String(value)}</span>;
}, (prevProps, nextProps) => {
  if (prevProps.value !== nextProps.value) return false;
  if (prevProps.path !== nextProps.path) return false;
  if (prevProps.onTogglePath !== nextProps.onTogglePath) return false;

  const prevOpen = prevProps.openPaths.has(prevProps.path);
  const nextOpen = nextProps.openPaths.has(nextProps.path);
  if (prevOpen !== nextOpen) return false;

  if (!isExpandable(nextProps.value)) return true;
  if (!nextOpen) return true;

  return !isPathAffected(nextProps.path, nextProps.changedPath);
});

JsonValue.displayName = 'JsonValue';

export function JsonViewer({ data, collapsed, className }: JsonViewerProps) {
  const defaultOpenPaths = useMemo(() => createDefaultOpenPaths(data, collapsed), [data, collapsed]);
  const [openPaths, setOpenPaths] = useState<Set<string>>(defaultOpenPaths);
  const [changedPath, setChangedPath] = useState(ROOT_PATH);

  useEffect(() => {
    setOpenPaths(defaultOpenPaths);
    setChangedPath(ROOT_PATH);
  }, [defaultOpenPaths]);

  const onTogglePath = useCallback((path: string) => {
    setChangedPath(path);
    setOpenPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  return (
    <pre
      className={cn(className)}
      style={PRE_STYLE}
    >
      <JsonValue
        value={data}
        path={ROOT_PATH}
        openPaths={openPaths}
        changedPath={changedPath}
        onTogglePath={onTogglePath}
      />
    </pre>
  );
}
