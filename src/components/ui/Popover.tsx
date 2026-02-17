import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

export interface PopoverProps {
  trigger: React.ReactElement<any, any>;
  content: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  offset?: number;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

interface PopoverPosition {
  top: number;
  left: number;
  minWidth: number;
  transform?: string;
}

function mergeHandlers<E>(
  first?: (event: E) => void,
  second?: (event: E) => void,
) {
  return (event: E) => {
    first?.(event);
    second?.(event);
  };
}

export function Popover({
  trigger,
  content,
  open,
  onOpenChange,
  side = 'bottom',
  align = 'center',
  offset = 8,
  disabled = false,
  className,
  contentClassName,
}: PopoverProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isControlled = open != null;
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const isOpen = isControlled ? !!open : internalOpen;

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const updatePosition = useCallback(() => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;

    const xTransform = align === 'center' ? 'translateX(-50%)' : align === 'end' ? 'translateX(-100%)' : '';
    const yTransform = side === 'top' ? 'translateY(-100%)' : '';
    const transform = `${xTransform} ${yTransform}`.trim() || undefined;

    setPosition({
      top: side === 'bottom' ? rect.bottom + offset : rect.top - offset,
      left: align === 'start' ? rect.left : align === 'end' ? rect.right : rect.left + rect.width / 2,
      minWidth: Math.max(220, Math.round(rect.width)),
      transform,
    });
  }, [align, offset, side]);

  useEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }
    updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (rootRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      setOpen(false);
    };

    window.addEventListener('pointerdown', onPointerDown, true);
    return () => window.removeEventListener('pointerdown', onPointerDown, true);
  }, [isOpen, setOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onScrollOrResize = () => updatePosition();
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, setOpen]);

  const triggerNode = React.cloneElement(trigger, {
    onClick: mergeHandlers(trigger.props.onClick, () => {
      if (disabled) return;
      setOpen(!isOpen);
    }),
    onKeyDown: mergeHandlers(trigger.props.onKeyDown, (event: React.KeyboardEvent) => {
      if (disabled) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setOpen(!isOpen);
      }
    }),
    'aria-haspopup': 'dialog',
    'aria-expanded': isOpen,
  });

  return (
    <div ref={rootRef} className={cn(className)} style={{ position: 'relative', display: 'inline-flex' }}>
      {triggerNode}
      {isOpen && !disabled && position && createPortal(
        <div
          ref={contentRef}
          className={cn('go', contentClassName)}
          style={{
            position: 'fixed',
            zIndex: 260,
            top: position.top,
            left: position.left,
            minWidth: position.minWidth,
            maxWidth: 'min(360px, calc(100vw - 16px))',
            transform: position.transform,
            padding: '12px',
          }}
          role="dialog"
          aria-modal="false"
        >
          {content}
        </div>,
        document.body,
      )}
    </div>
  );
}
