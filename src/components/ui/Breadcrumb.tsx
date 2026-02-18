import React from 'react';
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

export function Breadcrumb({
  items,
  separator = '/',
  className,
}: BreadcrumbProps) {
  return (
    <nav className={cn(className)} aria-label="Breadcrumb">
      <ol
        style={{
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: 0,
          padding: 0,
          flexWrap: 'wrap',
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current ?? isLast;
          const key = item.id ?? item.href ?? `crumb-${index}`;

          return (
            <li key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {isCurrent ? (
                <span
                  aria-current="page"
                  style={{
                    fontSize: '12px',
                    color: 'var(--t1)',
                    fontWeight: 300,
                  }}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  onClick={(event) => {
                    if (!item.href) event.preventDefault();
                    item.onClick?.();
                  }}
                  style={{
                    fontSize: '12px',
                    color: 'var(--t3)',
                    textDecoration: 'none',
                    transition: 'color .15s',
                  }}
                >
                  {item.label}
                </a>
              )}
              {!isLast && (
                <span aria-hidden="true" style={{ color: 'var(--t4)', fontSize: '11px' }}>
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
