import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { useClickOutside } from '../../hooks/useClickOutside';

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
  const isControlled = open != null;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? !!open : internalOpen;

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  useClickOutside(rootRef, () => setOpen(false), isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, setOpen]);

  const contentStyle = useMemo<React.CSSProperties>(() => ({
    position: 'absolute',
    zIndex: 80,
    minWidth: '220px',
    [side === 'bottom' ? 'top' : 'bottom']: `calc(100% + ${offset}px)`,
    [align === 'start' ? 'left' : align === 'end' ? 'right' : 'left']: align === 'center' ? '50%' : 0,
    transform: align === 'center' ? 'translateX(-50%)' : undefined,
    padding: '12px',
  }), [align, offset, side]);

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
      {isOpen && !disabled && (
        <div className={cn('go', contentClassName)} style={contentStyle} role="dialog" aria-modal="false">
          {content}
        </div>
      )}
    </div>
  );
}
