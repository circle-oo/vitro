import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export type OverlaySide = 'top' | 'right' | 'bottom' | 'left';
export type OverlayAlign = 'start' | 'center' | 'end';

export interface UseOverlayPositionOptions {
  triggerRef: React.RefObject<HTMLElement | null>;
  overlayRef?: React.RefObject<HTMLElement | null>;
  side: OverlaySide;
  align: OverlayAlign;
  offset?: number;
  enabled?: boolean;
  matchTriggerWidth?: boolean;
}

export interface UseOverlayPositionResult {
  style: React.CSSProperties;
  actualSide: OverlaySide;
  update: () => void;
}

function sameStyle(a: React.CSSProperties, b: React.CSSProperties): boolean {
  return a.top === b.top && a.left === b.left && a.width === b.width;
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function computePosition(
  trigger: DOMRect,
  overlay: { width: number; height: number },
  side: OverlaySide,
  align: OverlayAlign,
  offset: number,
): { top: number; left: number; side: OverlaySide } {
  const viewportPadding = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const space = {
    top: trigger.top,
    bottom: viewportHeight - trigger.bottom,
    left: trigger.left,
    right: viewportWidth - trigger.right,
  };

  let actualSide = side;
  if (side === 'bottom' && space.bottom < overlay.height + offset && space.top > space.bottom) actualSide = 'top';
  if (side === 'top' && space.top < overlay.height + offset && space.bottom > space.top) actualSide = 'bottom';
  if (side === 'right' && space.right < overlay.width + offset && space.left > space.right) actualSide = 'left';
  if (side === 'left' && space.left < overlay.width + offset && space.right > space.left) actualSide = 'right';

  let top = trigger.top;
  let left = trigger.left;

  if (actualSide === 'bottom' || actualSide === 'top') {
    top = actualSide === 'bottom'
      ? trigger.bottom + offset
      : trigger.top - overlay.height - offset;

    if (align === 'start') left = trigger.left;
    if (align === 'center') left = trigger.left + trigger.width / 2 - overlay.width / 2;
    if (align === 'end') left = trigger.right - overlay.width;
  } else {
    left = actualSide === 'right'
      ? trigger.right + offset
      : trigger.left - overlay.width - offset;

    if (align === 'start') top = trigger.top;
    if (align === 'center') top = trigger.top + trigger.height / 2 - overlay.height / 2;
    if (align === 'end') top = trigger.bottom - overlay.height;
  }

  // Keep overlays in viewport even when overlay dimensions exceed viewport.
  const maxTop = Math.max(viewportPadding, viewportHeight - overlay.height - viewportPadding);
  const maxLeft = Math.max(viewportPadding, viewportWidth - overlay.width - viewportPadding);
  top = Math.round(Math.min(Math.max(top, viewportPadding), maxTop));
  left = Math.round(Math.min(Math.max(left, viewportPadding), maxLeft));

  return { top, left, side: actualSide };
}

export function useOverlayPosition({
  triggerRef,
  overlayRef,
  side,
  align,
  offset = 8,
  enabled = true,
  matchTriggerWidth = false,
}: UseOverlayPositionOptions): UseOverlayPositionResult {
  const [actualSide, setActualSide] = useState<OverlaySide>(side);
  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
  });
  const rafIdRef = useRef<number | null>(null);
  const styleRef = useRef(style);
  const sideRef = useRef(actualSide);

  styleRef.current = style;
  sideRef.current = actualSide;

  const updateNow = useCallback(() => {
    if (!enabled) return;
    const trigger = triggerRef.current?.getBoundingClientRect();
    if (!trigger) return;

    const overlayWidth = overlayRef?.current?.offsetWidth || 220;
    const overlayHeight = overlayRef?.current?.offsetHeight || 160;

    const next = computePosition(trigger, { width: overlayWidth, height: overlayHeight }, side, align, offset);

    if (sideRef.current !== next.side) {
      setActualSide(next.side);
    }

    const nextStyle: React.CSSProperties = {
      position: 'fixed',
      top: next.top,
      left: next.left,
      width: matchTriggerWidth ? Math.round(trigger.width) : undefined,
    };

    if (!sameStyle(styleRef.current, nextStyle)) {
      setStyle(nextStyle);
    }
  }, [align, enabled, matchTriggerWidth, offset, overlayRef, side, triggerRef]);

  const scheduleUpdate = useCallback(() => {
    if (!enabled) return;
    if (rafIdRef.current != null) return;
    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
      updateNow();
    });
  }, [enabled, updateNow]);

  const update = useCallback(() => {
    if (rafIdRef.current != null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    updateNow();
  }, [updateNow]);

  useIsomorphicLayoutEffect(() => {
    if (!enabled) return;
    update();
  }, [enabled, update]);

  useEffect(() => {
    if (!enabled) return;
    const onScrollOrResize = () => scheduleUpdate();
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('orientationchange', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.visualViewport?.addEventListener('resize', onScrollOrResize);
    window.visualViewport?.addEventListener('scroll', onScrollOrResize);

    return () => {
      if (rafIdRef.current != null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('orientationchange', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.visualViewport?.removeEventListener('resize', onScrollOrResize);
      window.visualViewport?.removeEventListener('scroll', onScrollOrResize);
    };
  }, [enabled, scheduleUpdate]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof ResizeObserver === 'undefined') return;

    const triggerElement = triggerRef.current;
    const overlayElement = overlayRef?.current;
    if (!triggerElement && !overlayElement) return;

    const observer = new ResizeObserver(() => scheduleUpdate());
    if (triggerElement) observer.observe(triggerElement);
    if (overlayElement) observer.observe(overlayElement);

    return () => observer.disconnect();
  }, [enabled, overlayRef, scheduleUpdate, triggerRef]);

  return {
    style,
    actualSide,
    update,
  };
}
