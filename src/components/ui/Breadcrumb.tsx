import React, { useCallback } from 'react';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  id?: string;
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

const LIST_STYLE: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  margin: 0,
  padding: 0,
  flexWrap: 'wrap',
};

const ITEM_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
};

const CURRENT_LABEL_STYLE: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--t1)',
  fontWeight: 300,
};

const LINK_STYLE: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--t3)',
  textDecoration: 'none',
  transition: 'color .15s',
};

const SEPARATOR_STYLE: React.CSSProperties = {
  color: 'var(--t4)',
  fontSize: '11px',
};

interface BreadcrumbRowProps {
  item: BreadcrumbItem;
  isCurrent: boolean;
  isLast: boolean;
  separator: React.ReactNode;
}

const BreadcrumbRow = React.memo(function BreadcrumbRow({
  item,
  isCurrent,
  isLast,
  separator,
}: BreadcrumbRowProps) {
  const onLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!item.href) event.preventDefault();
    item.onClick?.();
  }, [item]);

  return (
    <li style={ITEM_STYLE}>
      {isCurrent ? (
        <span
          aria-current="page"
          style={CURRENT_LABEL_STYLE}
        >
          {item.label}
        </span>
      ) : (
        <a
          href={item.href}
          onClick={onLinkClick}
          style={LINK_STYLE}
        >
          {item.label}
        </a>
      )}
      {!isLast && (
        <span aria-hidden="true" style={SEPARATOR_STYLE}>
          {separator}
        </span>
      )}
    </li>
  );
});

BreadcrumbRow.displayName = 'BreadcrumbRow';

export function Breadcrumb({
  items,
  separator = '/',
  className,
}: BreadcrumbProps) {
  return (
    <nav className={cn(className)} aria-label="Breadcrumb">
      <ol
        style={LIST_STYLE}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current ?? isLast;
          const key = item.id ?? item.href ?? `crumb-${index}`;

          return (
            <BreadcrumbRow
              key={key}
              item={item}
              isCurrent={isCurrent}
              isLast={isLast}
              separator={separator}
            />
          );
        })}
      </ol>
    </nav>
  );
}
