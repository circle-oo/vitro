import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { useOverlayPosition, type OverlayAlign, type OverlaySide } from './useOverlayPosition';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: OverlaySide;
  align?: OverlayAlign;
  offset?: number;
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  offset = 10,
  delay = 300,
  disabled = false,
  className,
}: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const tooltipId = useId().replace(/:/g, '');

  const overlayPosition = useOverlayPosition({
    triggerRef,
    overlayRef: tooltipRef,
    side,
    align,
    offset,
    enabled: open && !disabled && !!content,
  });

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const openWithDelay = () => {
    if (disabled || !content) return;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, delay);
  };

  const closeNow = () => {
    clearTimer();
    setOpen(false);
  };

  useEffect(() => () => clearTimer(), []);

  return (
    <>
      <span
        ref={triggerRef}
        className={cn(className)}
        onMouseEnter={openWithDelay}
        onMouseLeave={closeNow}
        onFocus={openWithDelay}
        onBlur={closeNow}
        aria-describedby={open ? `vitro-tooltip-${tooltipId}` : undefined}
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        {children}
      </span>

      {open && !disabled && !!content && createPortal(
        <div
          ref={tooltipRef}
          id={`vitro-tooltip-${tooltipId}`}
          role="tooltip"
          className="go"
          style={{
            ...overlayPosition.style,
            zIndex: 240,
            padding: '7px 10px',
            borderRadius: '10px',
            fontSize: '11px',
            color: 'var(--t1)',
            pointerEvents: 'none',
            maxWidth: '260px',
            lineHeight: 1.4,
            whiteSpace: 'normal',
          }}
        >
          {content}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              background: 'var(--go-bg)',
              border: '1px solid var(--go-bd)',
              transform: 'rotate(45deg)',
              ...(overlayPosition.actualSide === 'top'
                ? { left: '50%', bottom: '-4px', marginLeft: '-4px', borderTop: 'none', borderLeft: 'none' }
                : overlayPosition.actualSide === 'bottom'
                  ? { left: '50%', top: '-4px', marginLeft: '-4px', borderBottom: 'none', borderRight: 'none' }
                  : overlayPosition.actualSide === 'left'
                    ? { top: '50%', right: '-4px', marginTop: '-4px', borderTop: 'none', borderRight: 'none' }
                    : { top: '50%', left: '-4px', marginTop: '-4px', borderBottom: 'none', borderLeft: 'none' }),
            }}
          />
        </div>,
        document.body,
      )}
    </>
  );
}
