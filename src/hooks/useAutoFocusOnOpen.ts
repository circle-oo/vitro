import { useEffect } from 'react';

export interface UseAutoFocusOnOpenOptions {
  enabled?: boolean;
  delayFrames?: number;
}

export function useAutoFocusOnOpen(
  open: boolean,
  onFocus: () => void,
  options: UseAutoFocusOnOpenOptions = {},
) {
  const { enabled = true, delayFrames = 1 } = options;

  useEffect(() => {
    if (!open || !enabled || typeof window === 'undefined') return;

    const frameCount = Math.max(1, delayFrames);
    let frame = 0;
    let raf = 0;

    const run = () => {
      frame += 1;
      if (frame >= frameCount) {
        onFocus();
        return;
      }
      raf = window.requestAnimationFrame(run);
    };

    raf = window.requestAnimationFrame(run);
    return () => window.cancelAnimationFrame(raf);
  }, [delayFrames, enabled, onFocus, open]);
}
