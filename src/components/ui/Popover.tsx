import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks/useControllableState';
import { useDismissibleLayer } from '../../hooks/useDismissibleLayer';
import { useOverlayPosition } from './useOverlayPosition';
import { focusFirstElement, trapTabKey } from '../../utils/focus';

export interface PopoverProps {
  trigger: React.ReactElement<any, any>;
  content?: React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  offset?: number;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
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
  children,
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
  const [isOpen, setOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: false,
    onChange: onOpenChange,
  });
  const resolvedContent = children ?? content;
  const overlayPosition = useOverlayPosition({
    triggerRef: rootRef,
    overlayRef: contentRef,
    side,
    align,
    offset,
    enabled: isOpen && !disabled,
  });

  useDismissibleLayer({
    open: isOpen,
    refs: [rootRef, contentRef],
    onDismiss: () => setOpen(false),
  });

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const content = contentRef.current;
      const active = document.activeElement as HTMLElement | null;
      if (!content || (active && !content.contains(active))) return;
      trapTabKey(event, contentRef.current);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const raf = window.requestAnimationFrame(() => {
      focusFirstElement(contentRef.current, contentRef.current);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [isOpen]);

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
      {isOpen && !disabled && createPortal(
        <div
          ref={contentRef}
          className={cn('go', contentClassName)}
          tabIndex={-1}
          style={{
            zIndex: 260,
            ...overlayPosition.style,
            minWidth: Math.max(180, rootRef.current?.offsetWidth ?? 0),
            maxWidth: 'min(360px, calc(100vw - 16px))',
            padding: '12px',
          }}
          role="dialog"
          aria-modal="false"
        >
          {resolvedContent}
        </div>,
        document.body,
      )}
    </div>
  );
}
