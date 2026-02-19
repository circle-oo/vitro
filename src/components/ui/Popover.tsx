import React, { useCallback, useMemo, useRef } from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks/useControllableState';
import { useAutoFocusOnOpen } from '../../hooks/useAutoFocusOnOpen';
import { useDismissibleLayer } from '../../hooks/useDismissibleLayer';
import { useOverlayPosition } from './useOverlayPosition';
import { focusFirstElement, trapTabKey } from '../../utils/focus';
import { mergeHandlers } from '../../utils/events';
import { Portal } from './Portal';

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

const ROOT_STYLE: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
};

const CONTENT_BASE_STYLE: React.CSSProperties = {
  zIndex: 260,
  maxWidth: 'min(360px, calc(100vw - 16px))',
  padding: '12px',
};

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
  React.useEffect(() => {
    if (!disabled) return;
    if (!isOpen) return;
    setOpen(false);
  }, [disabled, isOpen, setOpen]);
  const focusContent = useCallback(() => {
    focusFirstElement(contentRef.current, contentRef.current);
  }, []);
  useAutoFocusOnOpen(isOpen, focusContent);

  const onTriggerClick = useCallback(() => {
    if (disabled) return;
    setOpen((current) => !current);
  }, [disabled, setOpen]);

  const onTriggerKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen((current) => !current);
    }
  }, [disabled, setOpen]);

  const onContentKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      window.requestAnimationFrame(() => {
        const element = rootRef.current?.firstElementChild;
        if (element instanceof HTMLElement) element.focus();
      });
      return;
    }
    trapTabKey(event, contentRef.current);
  }, [setOpen]);

  const contentStyle = useMemo<React.CSSProperties>(
    () => ({
      ...CONTENT_BASE_STYLE,
      ...overlayPosition.style,
      minWidth: Math.max(180, rootRef.current?.offsetWidth ?? 0),
    }),
    [overlayPosition.style],
  );

  const triggerNode = React.cloneElement(trigger, {
    onClick: mergeHandlers(trigger.props.onClick, onTriggerClick),
    onKeyDown: mergeHandlers(trigger.props.onKeyDown, onTriggerKeyDown),
    'aria-haspopup': 'dialog',
    'aria-expanded': isOpen,
  });

  return (
    <div ref={rootRef} className={cn(className)} style={ROOT_STYLE}>
      {triggerNode}
      {isOpen && !disabled && (
        <Portal>
          <div
            ref={contentRef}
            className={cn('go', contentClassName)}
            data-side={overlayPosition.actualSide}
            tabIndex={-1}
            onKeyDown={onContentKeyDown}
            style={contentStyle}
            role="dialog"
            aria-modal="false"
          >
            {resolvedContent}
          </div>
        </Portal>
      )}
    </div>
  );
}
