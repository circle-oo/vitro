import { useSyncExternalStore } from 'react';
import { useMediaQuery } from './useMediaQuery';

export type MotionMode = 'full' | 'lite' | 'off';

function readMotionMode(): MotionMode {
  if (typeof document === 'undefined') return 'full';
  const mode = document.documentElement.dataset.motion;
  if (mode === 'lite' || mode === 'off' || mode === 'full') return mode;
  return 'full';
}

function subscribeMotionMode(onStoreChange: () => void): () => void {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {};
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-motion') {
        onStoreChange();
        break;
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-motion'],
  });

  return () => observer.disconnect();
}

export function useMotionMode(): MotionMode {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const mode = useSyncExternalStore(
    subscribeMotionMode,
    readMotionMode,
    () => 'full' as MotionMode,
  );
  if (prefersReducedMotion) return 'off';
  return mode;
}

export function useReducedMotion(): boolean {
  return useMotionMode() === 'off';
}
