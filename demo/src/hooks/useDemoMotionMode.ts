import { useEffect, useMemo } from 'react';
import { useMediaQuery } from '@circle-oo/vitro';

export type DemoMotionMode = 'full' | 'lite' | 'off';

interface UseDemoMotionModeOptions {
  constrainedNetwork: boolean;
  isMobile: boolean;
}

export function useDemoMotionMode({
  constrainedNetwork,
  isMobile,
}: UseDemoMotionModeOptions): DemoMotionMode {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const coarsePointer = useMediaQuery('(pointer: coarse)');

  const motionMode = useMemo<DemoMotionMode>(() => {
    if (prefersReducedMotion) return 'off';
    if (constrainedNetwork) return 'lite';
    if (isMobile || coarsePointer) return 'lite';
    return 'full';
  }, [coarsePointer, constrainedNetwork, isMobile, prefersReducedMotion]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.dataset.motion = motionMode;
    return () => {
      if (root.dataset.motion === motionMode) {
        delete root.dataset.motion;
      }
    };
  }, [motionMode]);

  return motionMode;
}
