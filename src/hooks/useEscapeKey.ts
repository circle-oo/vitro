import { useEffect, useRef } from 'react';

export interface UseEscapeKeyOptions {
  enabled?: boolean;
  target?: Window | Document | null;
  capture?: boolean;
}

export function useEscapeKey(
  onEscape: () => void,
  options: UseEscapeKeyOptions = {},
): void {
  const {
    enabled = true,
    target = typeof window !== 'undefined' ? window : null,
    capture = false,
  } = options;

  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!enabled || !target) return;

    const onKeyDown: EventListener = (event) => {
      if (!(event instanceof KeyboardEvent)) return;
      if (event.key !== 'Escape') return;
      onEscapeRef.current();
    };

    target.addEventListener('keydown', onKeyDown, capture);
    return () => target.removeEventListener('keydown', onKeyDown, capture);
  }, [capture, enabled, target]);
}
