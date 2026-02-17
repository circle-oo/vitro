import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
type TooltipAlign = 'start' | 'center' | 'end';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: TooltipSide;
  align?: TooltipAlign;
  offset?: number;
  delay?: number;
  disabled?: boolean;
  className?: string;
}

interface Position {
  top: number;
  left: number;
}

function computePosition(
  rect: DOMRect,
  side: TooltipSide,
  align: TooltipAlign,
  offset: number,
): Position {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  if (side === 'top') {
    return {
      top: rect.top - offset,
      left: align === 'start' ? rect.left : align === 'end' ? rect.right : centerX,
    };
  }
  if (side === 'bottom') {
    return {
      top: rect.bottom + offset,
      left: align === 'start' ? rect.left : align === 'end' ? rect.right : centerX,
    };
  }
  if (side === 'left') {
    return {
      top: align === 'start' ? rect.top : align === 'end' ? rect.bottom : centerY,
      left: rect.left - offset,
    };
  }
  return {
    top: align === 'start' ? rect.top : align === 'end' ? rect.bottom : centerY,
    left: rect.right + offset,
  };
}

function getTransform(side: TooltipSide, align: TooltipAlign) {
  if (side === 'top' || side === 'bottom') {
    return align === 'start' ? 'translateX(0)' : align === 'end' ? 'translateX(-100%)' : 'translateX(-50%)';
  }
  return align === 'start' ? 'translateY(0)' : align === 'end' ? 'translateY(-100%)' : 'translateY(-50%)';
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  offset = 10,
  delay = 120,
  disabled = false,
  className,
}: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const tooltipId = useId().replace(/:/g, '');

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(computePosition(rect, side, align, offset));
  };

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
      updatePosition();
      setOpen(true);
    }, delay);
  };

  const closeNow = () => {
    clearTimer();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => updatePosition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open]);

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
          id={`vitro-tooltip-${tooltipId}`}
          role="tooltip"
          className="go"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            transform: getTransform(side, align),
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
        </div>,
        document.body,
      )}
    </>
  );
}
