import { useEffect, useRef } from 'react';

interface UseDismissibleLayerOptions {
  open: boolean;
  refs: Array<React.RefObject<HTMLElement | null>>;
  onDismiss: () => void;
  dismissOnPointerDown?: boolean;
  dismissOnEscape?: boolean;
}

export function useDismissibleLayer({
  open,
  refs,
  onDismiss,
  dismissOnPointerDown = true,
  dismissOnEscape = true,
}: UseDismissibleLayerOptions): void {
  const refsRef = useRef(refs);
  const onDismissRef = useRef(onDismiss);
  refsRef.current = refs;
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!open) return;

    const isInside = (target: Node) => refsRef.current.some((ref) => ref.current?.contains(target));

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (isInside(target)) return;
      onDismissRef.current();
    };

    const onKeyDown: EventListener = (event) => {
      if (!(event instanceof KeyboardEvent)) return;
      if (event.key !== 'Escape') return;
      onDismissRef.current();
    };

    if (dismissOnPointerDown) {
      window.addEventListener('pointerdown', onPointerDown, true);
    }
    if (dismissOnEscape) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      if (dismissOnPointerDown) {
        window.removeEventListener('pointerdown', onPointerDown, true);
      }
      if (dismissOnEscape) {
        window.removeEventListener('keydown', onKeyDown);
      }
    };
  }, [dismissOnEscape, dismissOnPointerDown, open]);
}
