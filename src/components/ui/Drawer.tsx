import React, { useCallback, useEffect, useMemo, useRef } from 'react';
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

const BACKDROP_STYLE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, .2)',
  zIndex: 40,
  animation: 'vitro-fade-in .2s ease',
};

const PANEL_BASE_STYLE: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  maxWidth: 'min(100vw, 92vw)',
  zIndex: 41,
  padding: '20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
};

const PANEL_RIGHT_STYLE: React.CSSProperties = {
  right: 0,
  borderLeft: '1px solid var(--gs-bd)',
  animation: 'vitro-drawer-in-right .25s var(--ease)',
};

const PANEL_LEFT_STYLE: React.CSSProperties = {
  left: 0,
  borderRight: '1px solid var(--gs-bd)',
  animation: 'vitro-drawer-in-left .25s var(--ease)',
};

const HEADER_STYLE: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
};

const TITLE_STYLE: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  margin: 0,
};

const CLOSE_BUTTON_STYLE: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'var(--t2)',
  cursor: 'pointer',
  fontSize: '18px',
  minHeight: 'unset',
  padding: 0,
};

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

    const raf = window.requestAnimationFrame(() => {
      focusFirstElement(panelRef.current, panelRef.current);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [open]);

  const onBackdropMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  }, [onClose]);

  const onPanelKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    trapTabKey(event, panelRef.current);
  }, []);

  const panelStyle = useMemo<React.CSSProperties>(
    () => ({
      ...PANEL_BASE_STYLE,
      ...(side === 'right' ? PANEL_RIGHT_STYLE : PANEL_LEFT_STYLE),
      width,
    }),
    [side, width],
  );

  if (!open) return null;

  return createPortal(
    <>
      <div
        onMouseDown={onBackdropMouseDown}
        style={BACKDROP_STYLE}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onKeyDown={onPanelKeyDown}
        className={cn('gs', className)}
        data-side={side}
        style={panelStyle}
      >
        <div style={HEADER_STYLE}>
          {title ? (
            <h2 style={TITLE_STYLE}>{title}</h2>
          ) : <span />}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            style={CLOSE_BUTTON_STYLE}
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
