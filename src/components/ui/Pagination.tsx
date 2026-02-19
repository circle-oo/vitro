import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';

type Token = number | 'ellipsis-left' | 'ellipsis-right';

const NAV_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flexWrap: 'wrap',
};

const BUTTON_BASE_STYLE: React.CSSProperties = {
  minWidth: '36px',
  height: '36px',
  borderRadius: 'var(--r-chip)',
  border: 'none',
};

const ARROW_BUTTON_BASE_STYLE: React.CSSProperties = {
  ...BUTTON_BASE_STYLE,
  background: 'transparent',
  color: 'var(--t2)',
};

const PAGE_BUTTON_BASE_STYLE: React.CSSProperties = {
  ...BUTTON_BASE_STYLE,
  transition: 'background .1s, color .1s',
};

const ELLIPSIS_STYLE: React.CSSProperties = {
  width: '36px',
  textAlign: 'center',
  fontSize: '13px',
  color: 'var(--t4)',
};

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function range(start: number, end: number): number[] {
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
}

function getTokens(page: number, totalPages: number, siblingCount: number): Token[] {
  const clampedPage = Math.min(Math.max(page, 1), totalPages);
  const maxVisible = siblingCount * 2 + 5;

  if (totalPages <= maxVisible) {
    return range(1, totalPages);
  }

  const left = Math.max(clampedPage - siblingCount, 1);
  const right = Math.min(clampedPage + siblingCount, totalPages);
  const showLeftDots = left > 2;
  const showRightDots = right < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const count = siblingCount * 2 + 3;
    return [...range(1, count), 'ellipsis-right', totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const count = siblingCount * 2 + 3;
    return [1, 'ellipsis-left', ...range(totalPages - count + 1, totalPages)];
  }

  return [1, 'ellipsis-left', ...range(left, right), 'ellipsis-right', totalPages];
}

function getArrowButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    ...ARROW_BUTTON_BASE_STYLE,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.35 : 1,
  };
}

function getPageButtonStyle(active: boolean): React.CSSProperties {
  return {
    ...PAGE_BUTTON_BASE_STYLE,
    background: active ? 'rgba(var(--gl), .16)' : 'transparent',
    color: active ? 'var(--p700)' : 'var(--t2)',
    fontWeight: active ? 700 : 500,
    cursor: active ? 'default' : 'pointer',
  };
}

export function Pagination({
  page,
  totalPages,
  onChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const safeTotal = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(page, 1), safeTotal);

  const tokens = useMemo(
    () => getTokens(safePage, safeTotal, siblingCount),
    [safePage, safeTotal, siblingCount],
  );

  return (
    <nav
      className={cn(className)}
      aria-label="Pagination"
      style={NAV_STYLE}
    >
      <button
        type="button"
        onClick={() => onChange(safePage - 1)}
        disabled={safePage <= 1}
        aria-label="Previous page"
        style={getArrowButtonStyle(safePage <= 1)}
      >
        {'\u25C0'}
      </button>

      {tokens.map((token) => {
        if (typeof token !== 'number') {
          return (
            <span
              key={token}
              aria-hidden="true"
              style={ELLIPSIS_STYLE}
            >
              ...
            </span>
          );
        }

        const active = token === safePage;

        return (
          <button
            key={token}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => onChange(token)}
            style={getPageButtonStyle(active)}
          >
            {token}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onChange(safePage + 1)}
        disabled={safePage >= safeTotal}
        aria-label="Next page"
        style={getArrowButtonStyle(safePage >= safeTotal)}
      >
        {'\u25B6'}
      </button>
    </nav>
  );
}
