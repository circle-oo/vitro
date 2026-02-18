import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { focusFirstElement, trapTabKey } from '../../utils/focus';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  width?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  side = 'right',
  width = '380px',
  title,
  children,
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEscapeKey(onClose, { enabled: open });
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    focusFirstElement(panelRef.current, panelRef.current);

    const onKeyDown = (event: KeyboardEvent) => {
      trapTabKey(event, panelRef.current);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      <div
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, .2)',
          zIndex: 40,
          animation: 'vitro-fade-in .2s ease',
        }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn('gs', className)}
        data-side={side}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          [side]: 0,
          width,
          maxWidth: 'min(100vw, 92vw)',
          zIndex: 41,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: side === 'right' ? '1px solid var(--gs-bd)' : 'none',
          borderRight: side === 'left' ? '1px solid var(--gs-bd)' : 'none',
          animation: side === 'right'
            ? 'vitro-drawer-in-right .25s var(--ease)'
            : 'vitro-drawer-in-left .25s var(--ease)',
        } as React.CSSProperties}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          {title ? (
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{title}</h2>
          ) : <span />}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--t2)',
              cursor: 'pointer',
              fontSize: '18px',
              minHeight: 'unset',
              padding: 0,
            }}
          >
            {'\u00D7'}
          </button>
        </div>

        <div>{children}</div>
      </div>
    </>,
    document.body,
  );
}
