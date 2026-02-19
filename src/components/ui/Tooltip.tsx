import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { useSafeId } from '../../hooks/useSafeId';
import { Portal } from './Portal';
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

const TRIGGER_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
};

const TOOLTIP_BASE_STYLE: React.CSSProperties = {
  zIndex: 240,
  padding: '7px 10px',
  borderRadius: '10px',
  fontSize: '11px',
  color: 'var(--t1)',
  pointerEvents: 'none',
  maxWidth: '260px',
  lineHeight: 1.4,
  whiteSpace: 'normal',
};

const ARROW_BASE_STYLE: React.CSSProperties = {
  position: 'absolute',
  width: '8px',
  height: '8px',
  background: 'var(--go-bg)',
  border: '1px solid var(--go-bd)',
  transform: 'rotate(45deg)',
};

const ARROW_POSITION_STYLE: Record<OverlaySide, React.CSSProperties> = {
  top: {
    left: '50%',
    bottom: '-4px',
    marginLeft: '-4px',
    borderTop: 'none',
    borderLeft: 'none',
  },
  bottom: {
    left: '50%',
    top: '-4px',
    marginLeft: '-4px',
    borderBottom: 'none',
    borderRight: 'none',
  },
  left: {
    top: '50%',
    right: '-4px',
    marginTop: '-4px',
    borderTop: 'none',
    borderRight: 'none',
  },
  right: {
    top: '50%',
    left: '-4px',
    marginTop: '-4px',
    borderBottom: 'none',
    borderLeft: 'none',
  },
};

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
  const hasContent = content !== null && content !== undefined && content !== false;
  const tooltipId = useSafeId();

  const overlayPosition = useOverlayPosition({
    triggerRef,
    overlayRef: tooltipRef,
    side,
    align,
    offset,
    enabled: open && !disabled && hasContent,
  });

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const openWithDelay = useCallback(() => {
    if (disabled || !hasContent) return;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, delay);
  }, [clearTimer, delay, disabled, hasContent]);

  const closeNow = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    if (!open) return;
    if (disabled || !hasContent) {
      closeNow();
    }
  }, [closeNow, disabled, hasContent, open]);

  const tooltipStyle = useMemo<React.CSSProperties>(
    () => ({
      ...overlayPosition.style,
      ...TOOLTIP_BASE_STYLE,
    }),
    [overlayPosition.style],
  );

  const arrowStyle = useMemo<React.CSSProperties>(
    () => ({
      ...ARROW_BASE_STYLE,
      ...ARROW_POSITION_STYLE[overlayPosition.actualSide],
    }),
    [overlayPosition.actualSide],
  );

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
        style={TRIGGER_STYLE}
      >
        {children}
      </span>

      {open && !disabled && hasContent && (
        <Portal>
          <div
            ref={tooltipRef}
            id={`vitro-tooltip-${tooltipId}`}
            role="tooltip"
            className="go"
            data-side={overlayPosition.actualSide}
            style={tooltipStyle}
          >
            {content}
            <span
              aria-hidden="true"
              style={arrowStyle}
            />
          </div>
        </Portal>
      )}
    </>
  );
}
